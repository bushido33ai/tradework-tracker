-- Fix profiles table security: Remove public read access and ensure proper access control

-- First, drop all existing SELECT policies on profiles to clean slate
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Enable users to view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;

-- Drop the insecure customer profile creation policy
DROP POLICY IF EXISTS "Users can create customer profiles" ON public.profiles;

-- Create secure policies for SELECT
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Ensure INSERT policy requires authentication
DROP POLICY IF EXISTS "Authenticated users can create their own profiles" ON public.profiles;

CREATE POLICY "Authenticated users can create their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Keep UPDATE policies secure (already good)
-- Keep DELETE policies secure (already good)