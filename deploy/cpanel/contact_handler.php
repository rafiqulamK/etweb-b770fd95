<?php
// Simple contact handler for cPanel deployments
// Saves submissions to data/contacts.csv and sends email if configured

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    // Fallback to form-encoded
    $input = $_POST;
}

$name = isset($input['name']) ? trim($input['name']) : '';
$email = isset($input['email']) ? trim($input['email']) : '';
$phone = isset($input['phone']) ? trim($input['phone']) : '';
$subject = isset($input['subject']) ? trim($input['subject']) : '';
$message = isset($input['message']) ? trim($input['message']) : '';

if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

$csvFile = $dataDir . '/contacts.csv';
$fp = fopen($csvFile, 'a');
if ($fp) {
    // CSV: timestamp, name, email, phone, subject, message
    fputcsv($fp, [date('c'), $name, $email, $phone, $subject, $message]);
    fclose($fp);
}

$sendEmail = getenv('CPANEL_CONTACT_EMAIL');
if ($sendEmail) {
    $to = $sendEmail;
    $emailSubject = 'Website Contact Form: ' . ($subject ?: 'New Message');
    $body = "Name: $name\nEmail: $email\nPhone: $phone\n\nMessage:\n$message";
    $headers = "From: no-reply@" . ($_SERVER['SERVER_NAME'] ?? 'localhost') . "\r\n";
    @mail($to, $emailSubject, $body, $headers);
}

echo json_encode(['success' => true]);

?>
