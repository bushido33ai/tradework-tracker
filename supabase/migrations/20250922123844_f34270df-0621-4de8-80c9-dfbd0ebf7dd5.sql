-- Create a table for tracking money received for jobs
CREATE TABLE public.job_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.job_payments ENABLE ROW LEVEL SECURITY;

-- Create policies for job payments
CREATE POLICY "Users can create payments for their jobs" 
ON public.job_payments 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM jobs 
    WHERE jobs.id = job_payments.job_id 
    AND (jobs.created_by = auth.uid() OR jobs.assigned_to = auth.uid())
  ) 
  AND auth.uid() = created_by
);

CREATE POLICY "Users can view payments of their jobs" 
ON public.job_payments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM jobs 
    WHERE jobs.id = job_payments.job_id 
    AND (jobs.created_by = auth.uid() OR jobs.assigned_to = auth.uid())
  )
);

CREATE POLICY "Users can update their own payments" 
ON public.job_payments 
FOR UPDATE 
USING (
  auth.uid() = created_by 
  AND EXISTS (
    SELECT 1 FROM jobs 
    WHERE jobs.id = job_payments.job_id 
    AND (jobs.created_by = auth.uid() OR jobs.assigned_to = auth.uid())
  )
);

CREATE POLICY "Users can delete their own payments" 
ON public.job_payments 
FOR DELETE 
USING (
  auth.uid() = created_by 
  AND EXISTS (
    SELECT 1 FROM jobs 
    WHERE jobs.id = job_payments.job_id 
    AND (jobs.created_by = auth.uid() OR jobs.assigned_to = auth.uid())
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_job_payments_updated_at
BEFORE UPDATE ON public.job_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();