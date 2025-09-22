-- Create pending_verifications table for email confirmation
CREATE TABLE public.pending_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  surname TEXT NOT NULL,
  address TEXT NOT NULL,
  telephone TEXT NOT NULL,
  user_type TEXT NOT NULL,
  verification_token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '24 hours')
);

-- Enable Row Level Security
ALTER TABLE public.pending_verifications ENABLE ROW LEVEL SECURITY;

-- Create policy to prevent unauthorized access
CREATE POLICY "No direct access to pending verifications" 
ON public.pending_verifications 
FOR ALL
USING (false);

-- Create index for performance
CREATE INDEX idx_pending_verifications_token ON public.pending_verifications(verification_token);
CREATE INDEX idx_pending_verifications_email ON public.pending_verifications(email);
CREATE INDEX idx_pending_verifications_expires ON public.pending_verifications(expires_at);

-- Create function to clean up expired verifications
CREATE OR REPLACE FUNCTION public.cleanup_expired_verifications()
RETURNS void AS $$
BEGIN
  DELETE FROM public.pending_verifications 
  WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;