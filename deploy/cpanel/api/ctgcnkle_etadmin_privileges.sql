-- Run this as a superuser on the Postgres server (replace placeholders)
-- Usage (example):
-- psql -U postgres -h your_host -f ctgcnkle_etadmin_privileges.sql

-- Replace PASSWORD_HERE with a secure password before running
-- If the role already exists, you can omit CREATE ROLE and only run the GRANTs

DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'ctgcnkle_etadmin') THEN
      CREATE ROLE ctgcnkle_etadmin LOGIN PASSWORD 'PASSWORD_HERE';
   END IF;
END$$;

-- Allow connection to the target database
GRANT CONNECT ON DATABASE ctgcnkle_etweb TO ctgcnkle_etadmin;

-- Switch to the database to apply schema/table/sequence privileges
\connect ctgcnkle_etweb

-- Grant usage on the public schema
GRANT USAGE ON SCHEMA public TO ctgcnkle_etadmin;

-- Grant table privileges and set sensible default privileges for future objects
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ctgcnkle_etadmin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ctgcnkle_etadmin;

-- Sequences (for SERIAL / IDENTITY columns)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO ctgcnkle_etadmin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO ctgcnkle_etadmin;

-- Functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO ctgcnkle_etadmin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO ctgcnkle_etadmin;

-- If you need more granular access, adjust the above accordingly.

-- Notes:
-- 1) Replace 'PASSWORD_HERE' with a strong password before running.
-- 2) Run this file as the database superuser or a role with sufficient privileges.
-- 3) If your app only needs limited rights, remove privileges you don't need.
