-- Deny anonymous access to job_notes table
-- This ensures job notes remain private to authenticated job owners/assignees only
CREATE POLICY "Deny anon access to job notes"
ON public.job_notes
FOR ALL
TO anon
USING (false);