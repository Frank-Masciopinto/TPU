-- Add lock/pin columns for admin thread management
ALTER TABLE threads
  ADD COLUMN IF NOT EXISTS is_locked BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN NOT NULL DEFAULT FALSE;

-- Partial index for the unreplied-threads admin queue (avoids seq scan)
CREATE INDEX IF NOT EXISTS idx_threads_unreplied
  ON threads (created_at ASC)
  WHERE comment_count = 0;

-- Covering index for admin thread list sorted by newest
CREATE INDEX IF NOT EXISTS idx_threads_created_at
  ON threads (created_at DESC);

-- Rollback:
-- ALTER TABLE threads DROP COLUMN IF EXISTS is_locked;
-- ALTER TABLE threads DROP COLUMN IF EXISTS is_pinned;
-- DROP INDEX IF EXISTS idx_threads_unreplied;
-- DROP INDEX IF EXISTS idx_threads_created_at;
