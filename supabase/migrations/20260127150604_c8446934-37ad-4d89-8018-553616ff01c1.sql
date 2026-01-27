-- Block anonymous access to profiles table (contains sensitive personal data)
CREATE POLICY "Block anonymous access to profiles" 
ON public.profiles 
FOR ALL 
TO anon 
USING (false);

-- Block anonymous access to pending_verifications table (contains password hashes and tokens)
CREATE POLICY "Block anonymous access to pending_verifications" 
ON public.pending_verifications 
FOR ALL 
TO anon 
USING (false);