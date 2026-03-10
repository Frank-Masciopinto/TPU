-- threads and comments: user_id must be TEXT (not UUID) because BigCommerce
-- JWT sub claims are like "bc_123", not UUIDs.
-- Existing seed data uses UUIDs; USING user_id::text preserves them.

ALTER TABLE public.threads
  ALTER COLUMN user_id TYPE TEXT USING user_id::text;

ALTER TABLE public.comments
  ALTER COLUMN user_id TYPE TEXT USING user_id::text;
