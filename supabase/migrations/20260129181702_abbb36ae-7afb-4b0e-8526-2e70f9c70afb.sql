-- Fix infinite recursion in profiles RLS policies
-- The "Merchants can view tradesman profiles" policy causes infinite recursion
-- by querying the profiles table within its own policy check.
-- We already have the secure get_tradesman_directory() RPC function for merchants,
-- so this policy is unnecessary.

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Merchants can view tradesman profiles" ON public.profiles;