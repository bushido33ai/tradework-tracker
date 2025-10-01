-- Fix profiles table security issues

-- 1. Remove the dangerous public DELETE policy
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.profiles;

-- 2. Create a proper authenticated-only DELETE policy
CREATE POLICY "Users can delete own profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- 3. Add explicit denial for public role on all operations
CREATE POLICY "Block all public access to profiles"
ON public.profiles
FOR ALL
TO public
USING (false);

-- 4. Fix pending_verifications table to ensure no public access
DROP POLICY IF EXISTS "No direct access to pending verifications" ON public.pending_verifications;

CREATE POLICY "Block all public access to pending verifications"
ON public.pending_verifications
FOR ALL
TO public
USING (false);

CREATE POLICY "Block all authenticated access to pending verifications"
ON public.pending_verifications
FOR ALL
TO authenticated
USING (false);