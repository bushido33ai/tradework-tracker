-- Fix warn-level security issues

-- 1. Add DELETE policy for suppliers table
CREATE POLICY "Users can delete their own suppliers"
ON public.suppliers
FOR DELETE
TO authenticated
USING (auth.uid() = created_by);

-- 2. Drop the overly permissive public INSERT policy on access_requests
DROP POLICY IF EXISTS "Enable public registration requests" ON public.access_requests;

-- 3. Add storage bucket RLS policies for designs bucket
CREATE POLICY "Users can upload designs to their jobs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'designs' AND
  auth.uid() IN (
    SELECT created_by FROM jobs 
    WHERE id::text = (storage.foldername(name))[1]
    UNION
    SELECT assigned_to FROM jobs 
    WHERE id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Users can view designs of their jobs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'designs' AND
  auth.uid() IN (
    SELECT created_by FROM jobs 
    WHERE id::text = (storage.foldername(name))[1]
    UNION
    SELECT assigned_to FROM jobs 
    WHERE id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Users can delete designs of their jobs"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'designs' AND
  auth.uid() IN (
    SELECT created_by FROM jobs 
    WHERE id::text = (storage.foldername(name))[1]
    UNION
    SELECT assigned_to FROM jobs 
    WHERE id::text = (storage.foldername(name))[1]
  )
);

-- 4. Add storage bucket RLS policies for enquiry-designs bucket
CREATE POLICY "Users can upload designs to their enquiries"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'enquiry-designs' AND
  auth.uid() IN (
    SELECT created_by FROM enquiries 
    WHERE id::text = (storage.foldername(name))[1]
    UNION
    SELECT assigned_to FROM enquiries 
    WHERE id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Users can view designs of their enquiries"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'enquiry-designs' AND
  auth.uid() IN (
    SELECT created_by FROM enquiries 
    WHERE id::text = (storage.foldername(name))[1]
    UNION
    SELECT assigned_to FROM enquiries 
    WHERE id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Users can delete designs of their enquiries"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'enquiry-designs' AND
  auth.uid() IN (
    SELECT created_by FROM enquiries 
    WHERE id::text = (storage.foldername(name))[1]
    UNION
    SELECT assigned_to FROM enquiries 
    WHERE id::text = (storage.foldername(name))[1]
  )
);

-- 5. Add storage bucket RLS policies for invoices bucket
-- Service role can insert (for ingest-invoice edge function)
CREATE POLICY "Service role can upload invoices"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'invoices');

-- Users can view invoices of their jobs
CREATE POLICY "Users can view invoices of their jobs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'invoices' AND
  auth.uid() IN (
    SELECT created_by FROM jobs 
    WHERE id::text = (storage.foldername(name))[1]
    UNION
    SELECT assigned_to FROM jobs 
    WHERE id::text = (storage.foldername(name))[1]
  )
);

-- Users can delete invoices of their jobs
CREATE POLICY "Users can delete invoices of their jobs"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'invoices' AND
  auth.uid() IN (
    SELECT created_by FROM jobs 
    WHERE id::text = (storage.foldername(name))[1]
    UNION
    SELECT assigned_to FROM jobs 
    WHERE id::text = (storage.foldername(name))[1]
  )
);

-- Authenticated users can also upload invoices to their jobs (manual uploads)
CREATE POLICY "Users can upload invoices to their jobs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'invoices' AND
  auth.uid() IN (
    SELECT created_by FROM jobs 
    WHERE id::text = (storage.foldername(name))[1]
    UNION
    SELECT assigned_to FROM jobs 
    WHERE id::text = (storage.foldername(name))[1]
  )
);