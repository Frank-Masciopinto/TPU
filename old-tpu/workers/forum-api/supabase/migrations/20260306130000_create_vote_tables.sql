-- Create thread_votes and comment_votes tables for forum voting.
-- Keeps threads.score and comments.score in sync via triggers.

-- ============================================================
-- thread_votes
-- ============================================================
CREATE TABLE IF NOT EXISTS public.thread_votes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id  UUID NOT NULL REFERENCES public.threads(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL,
  value      SMALLINT NOT NULL CHECK (value IN (1, -1)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (thread_id, user_id)
);

ALTER TABLE public.thread_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read thread votes"
  ON public.thread_votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert their own thread votes"
  ON public.thread_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own thread votes"
  ON public.thread_votes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_thread_votes_thread ON public.thread_votes (thread_id);

-- ============================================================
-- comment_votes
-- ============================================================
CREATE TABLE IF NOT EXISTS public.comment_votes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL,
  value      SMALLINT NOT NULL CHECK (value IN (1, -1)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (comment_id, user_id)
);

ALTER TABLE public.comment_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comment votes"
  ON public.comment_votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert their own comment votes"
  ON public.comment_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own comment votes"
  ON public.comment_votes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_comment_votes_comment ON public.comment_votes (comment_id);

-- ============================================================
-- Trigger: sync threads.score from thread_votes
-- ============================================================
CREATE OR REPLACE FUNCTION public.refresh_thread_score()
RETURNS TRIGGER AS $$
DECLARE
  _tid UUID;
BEGIN
  _tid := COALESCE(NEW.thread_id, OLD.thread_id);
  UPDATE public.threads
     SET score = COALESCE((SELECT SUM(value) FROM public.thread_votes WHERE thread_id = _tid), 0)
   WHERE id = _tid;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_refresh_thread_score
  AFTER INSERT OR UPDATE OR DELETE ON public.thread_votes
  FOR EACH ROW EXECUTE FUNCTION public.refresh_thread_score();

-- ============================================================
-- Trigger: sync comments.score from comment_votes
-- ============================================================
CREATE OR REPLACE FUNCTION public.refresh_comment_score()
RETURNS TRIGGER AS $$
DECLARE
  _cid UUID;
BEGIN
  _cid := COALESCE(NEW.comment_id, OLD.comment_id);
  UPDATE public.comments
     SET score = COALESCE((SELECT SUM(value) FROM public.comment_votes WHERE comment_id = _cid), 0)
   WHERE id = _cid;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_refresh_comment_score
  AFTER INSERT OR UPDATE OR DELETE ON public.comment_votes
  FOR EACH ROW EXECUTE FUNCTION public.refresh_comment_score();

-- Let PostgREST pick up the new tables immediately
NOTIFY pgrst, 'reload schema';
