-- Add images column to threads and comments for forum image upload feature
-- Each column stores an array of R2 public URLs
-- Default '{}' ensures existing rows return an empty array (no backfill needed)

ALTER TABLE threads ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
ALTER TABLE comments ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
