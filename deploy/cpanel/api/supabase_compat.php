<?php
// Supabase-compatible PHP API using PDO (Postgres or MySQL)
// This file will use `deploy/cpanel/api/db_config.php` if present, otherwise
// it falls back to environment variables.

// Load embedded DB config if present
$embeddedConfig = null;
$configPath = __DIR__ . '/db_config.php';
if (file_exists($configPath)) {
    $embeddedConfig = include $configPath; // returns array
}

function getDbConnection() {
    global $embeddedConfig;

    $host = $embeddedConfig['DB_HOST'] ?? getenv('DB_HOST') ?: '127.0.0.1';
    $port = $embeddedConfig['DB_PORT'] ?? getenv('DB_PORT') ?: '5432';
    $db   = $embeddedConfig['DB_NAME'] ?? getenv('DB_NAME') ?: 'ctgcnkle_etweb';
    $user = $embeddedConfig['DB_USER'] ?? getenv('DB_USER') ?: 'ctgcnkle_etadmin';
    $pass = $embeddedConfig['DB_PASS'] ?? getenv('DB_PASS') ?: 'change_me';

    // Choose driver by port or DB_DRIVER env
    $driver = (getenv('DB_DRIVER') ?: null) ?? (($port === '3306') ? 'mysql' : 'pgsql');

    try {
        if ($driver === 'mysql') {
            $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";
        } else {
            $dsn = "pgsql:host=$host;port=$port;dbname=$db";
        }

        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        return ['pdo' => $pdo, 'driver' => $driver];
    } catch (PDOException $e) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'DB connection failed', 'message' => $e->getMessage()]);
        exit;
    }
}

// Basic CORS and JSON headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$db = getDbConnection();
$pdo = $db['pdo'];
$driver = $db['driver'];

// Basic routing by `action` parameter (GET or POST)
$action = $_GET['action'] ?? $_POST['action'] ?? null;

if ($action === 'submit_contact' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $name = $data['name'] ?? null;
    $email = $data['email'] ?? null;
    $message = $data['message'] ?? null;

    if (!$name || !$email) {
        http_response_code(400);
        echo json_encode(['error' => 'name and email required']);
        exit;
    }

    // Adjust the table name/columns to match your schema
    try {
        if ($driver === 'mysql') {
            $stmt = $pdo->prepare('INSERT INTO contacts (name, email, message, created_at) VALUES (:name, :email, :message, NOW())');
            $stmt->execute([':name' => $name, ':email' => $email, ':message' => $message]);
            $id = $pdo->lastInsertId();
        } else {
            $stmt = $pdo->prepare('INSERT INTO contacts (name, email, message, created_at) VALUES (:name, :email, :message, NOW()) RETURNING id');
            $stmt->execute([':name' => $name, ':email' => $email, ':message' => $message]);
            $id = $stmt->fetchColumn();
        }
        echo json_encode(['id' => $id, 'status' => 'ok']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'insert_failed', 'message' => $e->getMessage()]);
    }
    exit;
}

if ($action === 'list_contacts' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $limit = intval($_GET['limit'] ?? 100);
    // LIMIT binding is supported; works for Postgres and MySQL PDO
    $stmt = $pdo->prepare('SELECT id, name, email, message, created_at FROM contacts ORDER BY created_at DESC LIMIT :limit');
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();
    $rows = $stmt->fetchAll();
    echo json_encode($rows);
    exit;
}

// Default response for unknown action
http_response_code(400);
echo json_encode(['error' => 'unknown action', 'usage' => [
    'POST ?action=submit_contact  {name,email,message}',
    'GET  ?action=list_contacts&limit=50'
]]);

?>
