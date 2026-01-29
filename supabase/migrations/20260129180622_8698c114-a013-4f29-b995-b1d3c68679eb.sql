-- Fix 1: Block anonymous access to profiles table properly
-- Drop the existing restrictive policy and create a proper one
DROP POLICY IF EXISTS "Block anonymous access to profiles" ON public.profiles;

-- Create a proper policy that blocks anon access (PERMISSIVE SELECT requires auth)
CREATE POLICY "Require authentication for profiles access"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = id OR
  has_role(auth.uid(), 'admin'::app_role)
);

-- Fix 2: Block anonymous access to access_requests table
-- Create a policy to block anonymous access
CREATE POLICY "Block anonymous access to access_requests"
ON public.access_requests
FOR ALL
TO anon
USING (false);

-- Ensure authenticated users can only see their own requests (already exists, but add explicit auth check)
DROP POLICY IF EXISTS "Users can view their own access requests" ON public.access_requests;
CREATE POLICY "Users can view their own access requests"
ON public.access_requests
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Fix 3: Create RPC function for merchant tradesman directory with proper authorization
CREATE OR REPLACE FUNCTION public.get_tradesman_directory()
RETURNS TABLE (
  id UUID,
  first_name TEXT,
  surname TEXT,
  full_name TEXT,
  email TEXT,
  telephone TEXT,
  address TEXT
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only allow merchants to access this directory
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.user_type = 'merchant'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Merchant access only';
  END IF;
  
  RETURN QUERY
  SELECT 
    p.id,
    p.first_name,
    p.surname,
    p.full_name,
    p.email,
    p.telephone,
    p.address
  FROM public.profiles p
  WHERE p.user_type = 'tradesman';
END;
$$;

-- Add RLS policy for merchants to view tradesman profiles through the directory
CREATE POLICY "Merchants can view tradesman profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  -- Merchants can view tradesman profiles
  (
    EXISTS (
      SELECT 1 FROM public.profiles mp 
      WHERE mp.id = auth.uid() AND mp.user_type = 'merchant'
    )
    AND user_type = 'tradesman'
  )
);