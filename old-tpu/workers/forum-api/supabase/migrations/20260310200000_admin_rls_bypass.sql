-- Allow forum admins to update and delete any thread or comment.
-- Admin is identified by email match in forum_admins table.

-- threads: admin can delete any thread
CREATE POLICY "Admins can delete any thread"
  ON public.threads FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.forum_admins
      WHERE lower(forum_admins.email) = lower(auth.jwt()->>'email')
    )
  );

-- threads: admin can update any thread (for lock, pin, edit)
CREATE POLICY "Admins can update any thread"
  ON public.threads FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.forum_admins
      WHERE lower(forum_admins.email) = lower(auth.jwt()->>'email')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.forum_admins
      WHERE lower(forum_admins.email) = lower(auth.jwt()->>'email')
    )
  );

-- comments: admin can delete any comment
CREATE POLICY "Admins can delete any comment"
  ON public.comments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.forum_admins
      WHERE lower(forum_admins.email) = lower(auth.jwt()->>'email')
    )
  );

-- comments: admin can update any comment (for body edits)
CREATE POLICY "Admins can update any comment"
  ON public.comments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.forum_admins
      WHERE lower(forum_admins.email) = lower(auth.jwt()->>'email')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.forum_admins
      WHERE lower(forum_admins.email) = lower(auth.jwt()->>'email')
    )
  );

NOTIFY pgrst, 'reload schema';
