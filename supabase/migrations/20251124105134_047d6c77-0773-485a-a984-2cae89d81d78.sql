-- Create job_extras table
CREATE TABLE IF NOT EXISTS public.job_extras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.job_extras ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view extras of their jobs"
ON public.job_extras
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.jobs
    WHERE jobs.id = job_extras.job_id
    AND (jobs.created_by = auth.uid() OR jobs.assigned_to = auth.uid())
  )
);

CREATE POLICY "Users can create extras for their jobs"
ON public.job_extras
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.jobs
    WHERE jobs.id = job_extras.job_id
    AND (jobs.created_by = auth.uid() OR jobs.assigned_to = auth.uid())
  )
  AND auth.uid() = created_by
);

CREATE POLICY "Users can update their own extras"
ON public.job_extras
FOR UPDATE
USING (
  auth.uid() = created_by
  AND EXISTS (
    SELECT 1 FROM public.jobs
    WHERE jobs.id = job_extras.job_id
    AND (jobs.created_by = auth.uid() OR jobs.assigned_to = auth.uid())
  )
);

CREATE POLICY "Users can delete their own extras"
ON public.job_extras
FOR DELETE
USING (
  auth.uid() = created_by
  AND EXISTS (
    SELECT 1 FROM public.jobs
    WHERE jobs.id = job_extras.job_id
    AND (jobs.created_by = auth.uid() OR jobs.assigned_to = auth.uid())
  )
);

-- Add trigger for updated_at
CREATE TRIGGER update_job_extras_updated_at
BEFORE UPDATE ON public.job_extras
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();