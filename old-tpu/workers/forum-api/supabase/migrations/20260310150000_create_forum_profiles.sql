-- Create forum_profiles table for user identity in the forum
CREATE TABLE IF NOT EXISTS public.forum_profiles (
  user_id    UUID PRIMARY KEY,
  username   TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Case-insensitive uniqueness on username
CREATE UNIQUE INDEX IF NOT EXISTS idx_forum_profiles_username_lower
  ON public.forum_profiles (LOWER(username));

-- RLS
ALTER TABLE public.forum_profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read usernames (public display)
CREATE POLICY "Public read" ON public.forum_profiles
  FOR SELECT USING (true);

-- Users can insert their own profile
CREATE POLICY "Owner insert" ON public.forum_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Owner update" ON public.forum_profiles
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Grants
GRANT SELECT ON public.forum_profiles TO anon;
GRANT SELECT ON public.forum_profiles TO authenticated;
GRANT ALL ON public.forum_profiles TO service_role;
GRANT ALL ON public.forum_profiles TO postgres;

NOTIFY pgrst, 'reload schema';
