-- Support both Supabase Auth (UUID) and BigCommerce (bc_xxx) user IDs
-- BigCommerce auth uses sub = 'bc_{customerId}' which is not a valid UUID

-- Drop policies first (they depend on user_id)
DROP POLICY IF EXISTS "Owner insert" ON public.forum_profiles;
DROP POLICY IF EXISTS "Owner update" ON public.forum_profiles;

-- Alter column type
ALTER TABLE public.forum_profiles
  ALTER COLUMN user_id TYPE TEXT USING user_id::text;

-- Recreate owner policies to use JWT sub (text) instead of auth.uid() (uuid-only)
CREATE POLICY "Owner insert" ON public.forum_profiles
  FOR INSERT WITH CHECK ((auth.jwt()->>'sub') = user_id);

CREATE POLICY "Owner update" ON public.forum_profiles
  FOR UPDATE USING ((auth.jwt()->>'sub') = user_id)
  WITH CHECK ((auth.jwt()->>'sub') = user_id);

NOTIFY pgrst, 'reload schema';
