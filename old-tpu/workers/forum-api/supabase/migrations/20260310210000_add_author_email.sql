-- Store author email on threads and comments for admin badge detection.
-- Null for older rows; populated on new inserts.
ALTER TABLE threads ADD COLUMN IF NOT EXISTS author_email TEXT;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS author_email TEXT;

NOTIFY pgrst, 'reload schema';
