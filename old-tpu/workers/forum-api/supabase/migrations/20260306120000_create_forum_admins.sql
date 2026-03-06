-- Create forum_admins table for admin role management
CREATE TABLE IF NOT EXISTS public.forum_admins (
  email        TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: service_role can read (PostgREST uses service_role key)
ALTER TABLE public.forum_admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access"
  ON public.forum_admins
  FOR ALL
  USING (true)
  WITH CHECK (true);

GRANT SELECT ON public.forum_admins TO service_role;
GRANT ALL    ON public.forum_admins TO postgres;

-- Notify PostgREST to reload schema cache immediately
NOTIFY pgrst, 'reload schema';
