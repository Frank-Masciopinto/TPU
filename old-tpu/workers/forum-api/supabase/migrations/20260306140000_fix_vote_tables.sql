-- Fix vote tables: user_id must be TEXT (not UUID) because BigCommerce
-- token exchange creates sub claims like "bc_123", not UUIDs.
-- Also fix RLS policies to read JWT sub directly instead of auth.uid()
-- which casts to UUID and fails for non-UUID subjects.

-- ============================================================
-- thread_votes: drop ALL policies first, then alter column
-- ============================================================
DROP POLICY IF EXISTS "Anyone can read thread votes" ON public.thread_votes;
DROP POLICY IF EXISTS "Authenticated users can insert their own thread votes" ON public.thread_votes;
DROP POLICY IF EXISTS "Authenticated users can update their own thread votes" ON public.thread_votes;

ALTER TABLE public.thread_votes
  ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;

CREATE POLICY "Anyone can read thread votes"
  ON public.thread_votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert their own thread votes"
  ON public.thread_votes FOR INSERT
  WITH CHECK (
    (current_setting('request.jwt.claims', true)::jsonb ->> 'sub') = user_id
  );

CREATE POLICY "Authenticated users can update their own thread votes"
  ON public.thread_votes FOR UPDATE
  USING (
    (current_setting('request.jwt.claims', true)::jsonb ->> 'sub') = user_id
  )
  WITH CHECK (
    (current_setting('request.jwt.claims', true)::jsonb ->> 'sub') = user_id
  );

-- ============================================================
-- comment_votes: drop ALL policies first, then alter column
-- ============================================================
DROP POLICY IF EXISTS "Anyone can read comment votes" ON public.comment_votes;
DROP POLICY IF EXISTS "Authenticated users can insert their own comment votes" ON public.comment_votes;
DROP POLICY IF EXISTS "Authenticated users can update their own comment votes" ON public.comment_votes;

ALTER TABLE public.comment_votes
  ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;

CREATE POLICY "Anyone can read comment votes"
  ON public.comment_votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert their own comment votes"
  ON public.comment_votes FOR INSERT
  WITH CHECK (
    (current_setting('request.jwt.claims', true)::jsonb ->> 'sub') = user_id
  );

CREATE POLICY "Authenticated users can update their own comment votes"
  ON public.comment_votes FOR UPDATE
  USING (
    (current_setting('request.jwt.claims', true)::jsonb ->> 'sub') = user_id
  )
  WITH CHECK (
    (current_setting('request.jwt.claims', true)::jsonb ->> 'sub') = user_id
  );

-- Grant table permissions to authenticated role
GRANT SELECT, INSERT, UPDATE ON public.thread_votes TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.comment_votes TO authenticated;
GRANT SELECT ON public.thread_votes TO anon;
GRANT SELECT ON public.comment_votes TO anon;

NOTIFY pgrst, 'reload schema';
