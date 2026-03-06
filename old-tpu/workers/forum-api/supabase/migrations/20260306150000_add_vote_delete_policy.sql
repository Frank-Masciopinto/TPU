-- Allow authenticated users to delete their own votes (toggle off)

CREATE POLICY "Authenticated users can delete their own thread votes"
  ON public.thread_votes FOR DELETE
  USING (
    (current_setting('request.jwt.claims', true)::jsonb ->> 'sub') = user_id
  );

CREATE POLICY "Authenticated users can delete their own comment votes"
  ON public.comment_votes FOR DELETE
  USING (
    (current_setting('request.jwt.claims', true)::jsonb ->> 'sub') = user_id
  );

GRANT DELETE ON public.thread_votes TO authenticated;
GRANT DELETE ON public.comment_votes TO authenticated;

NOTIFY pgrst, 'reload schema';
