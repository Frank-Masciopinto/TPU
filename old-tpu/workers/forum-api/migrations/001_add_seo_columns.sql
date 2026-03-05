-- Add slug and summary columns to threads table for SEO optimization
-- Run this migration on your Supabase database before deploying the updated worker

-- Add slug column (URL-friendly identifier for threads)
ALTER TABLE threads ADD COLUMN IF NOT EXISTS slug TEXT;

-- Add summary column (admin-editable TL;DR for thread)
ALTER TABLE threads ADD COLUMN IF NOT EXISTS summary TEXT;

-- Create unique index on slug (enforces uniqueness, speeds up lookups)
CREATE UNIQUE INDEX IF NOT EXISTS idx_threads_slug ON threads (slug) WHERE slug IS NOT NULL;

-- Create index for sitemap queries (threads with answers, ordered by updated_at)
CREATE INDEX IF NOT EXISTS idx_threads_sitemap
  ON threads (updated_at DESC)
  WHERE comment_count > 0 AND slug IS NOT NULL;

-- Backfill slugs for existing threads that don't have one
-- This generates a slug from the title + first 6 chars of the id for uniqueness
UPDATE threads
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        LEFT(TRIM(title), 80),
        '[^a-zA-Z0-9\s-]', '', 'g'
      ),
      '\s+', '-', 'g'
    ),
    '-+', '-', 'g'
  )
) || '-' || LEFT(id::text, 6)
WHERE slug IS NULL AND title IS NOT NULL;
