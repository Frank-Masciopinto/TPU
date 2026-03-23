-- Nested replies: one level under a root comment (parent_id -> comments.id).
-- ON DELETE CASCADE removes replies when the parent comment is deleted.
ALTER TABLE public.comments
  ADD COLUMN IF NOT EXISTS parent_id UUID NULL
  REFERENCES public.comments(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_comments_thread_parent
  ON public.comments (thread_id, parent_id);

NOTIFY pgrst, 'reload schema';
