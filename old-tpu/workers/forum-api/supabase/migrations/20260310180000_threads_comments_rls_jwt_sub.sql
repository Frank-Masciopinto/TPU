-- Fix RLS on threads and comments: policies using auth.uid() fail when JWT sub
-- is not a UUID (e.g. BigCommerce "bc_123"). Replace with auth.jwt()->>'sub'.

-- Drop all existing policies on threads (names may vary)
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'threads'
  )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.threads', r.policyname);
  END LOOP;
END $$;

-- Drop all existing policies on comments
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'comments'
  )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.comments', r.policyname);
  END LOOP;
END $$;

-- Ensure RLS is enabled
ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- threads: read all, insert/update/delete when JWT sub = user_id
CREATE POLICY "Anyone can read threads"
  ON public.threads FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert own threads"
  ON public.threads FOR INSERT
  WITH CHECK ((auth.jwt()->>'sub') = user_id);

CREATE POLICY "Authenticated users can update own threads"
  ON public.threads FOR UPDATE
  USING ((auth.jwt()->>'sub') = user_id)
  WITH CHECK ((auth.jwt()->>'sub') = user_id);

CREATE POLICY "Authenticated users can delete own threads"
  ON public.threads FOR DELETE
  USING ((auth.jwt()->>'sub') = user_id);

-- comments: read all, insert/update/delete when JWT sub = user_id
CREATE POLICY "Anyone can read comments"
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert own comments"
  ON public.comments FOR INSERT
  WITH CHECK ((auth.jwt()->>'sub') = user_id);

CREATE POLICY "Authenticated users can update own comments"
  ON public.comments FOR UPDATE
  USING ((auth.jwt()->>'sub') = user_id)
  WITH CHECK ((auth.jwt()->>'sub') = user_id);

CREATE POLICY "Authenticated users can delete own comments"
  ON public.comments FOR DELETE
  USING ((auth.jwt()->>'sub') = user_id);

NOTIFY pgrst, 'reload schema';
