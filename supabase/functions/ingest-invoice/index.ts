
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function extractJobIdFromString(input: string): string | null {
  const match = input.match(/JobID\s*(\d+)/i);
  return match ? match[1] : null;
}

function extractAmountFromString(input: string): number | null {
  const match = input.match(/£\s*(\d+(?:\.\d{2})?)/);
  return match ? parseFloat(match[1]) : null;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Validate API key
    const apiKey = req.headers.get('x-api-key')
    if (!apiKey || apiKey !== Deno.env.get('INVOICE_INGESTION_API_KEY')) {
      console.error('Invalid API key provided');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const formData = await req.formData()
    let jobId = formData.get('jobId')?.toString()
    let amount = formData.get('amount')?.toString()
    const file = formData.get('file')
    const source = formData.get('source') || 'api'
    const externalReference = formData.get('externalReference')
    const emailSubject = formData.get('emailSubject')?.toString()

    // If jobId or amount not provided directly, try to extract from email subject
    if (emailSubject) {
      console.log('Processing email subject:', emailSubject);
      if (!jobId) {
        jobId = extractJobIdFromString(emailSubject);
        console.log('Extracted jobId:', jobId);
      }
      if (!amount) {
        const extractedAmount = extractAmountFromString(emailSubject);
        if (extractedAmount) {
          amount = extractedAmount.toString();
          console.log('Extracted amount:', amount);
        }
      }
    }

    // Validate required fields
    if (!file) {
      console.error('No file provided');
      return new Response(
        JSON.stringify({ error: 'Missing required field: file' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    if (!jobId) {
      console.error('No jobId provided or could not be extracted');
      return new Response(
        JSON.stringify({ error: 'Missing required field: jobId' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    if (!amount) {
      console.error('No amount provided or could not be extracted');
      return new Response(
        JSON.stringify({ error: 'Missing required field: amount' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify job exists
    const { data: jobExists, error: jobError } = await supabase
      .from('jobs')
      .select('id')
      .eq('job_number', `JOB-${jobId.padStart(4, '0')}`)
      .single()

    if (jobError || !jobExists) {
      console.error('Job not found:', jobId);
      return new Response(
        JSON.stringify({ error: `Job not found: JOB-${jobId.padStart(4, '0')}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Sanitize filename and prepare file path
    const sanitizedFileName = (file as File).name.replace(/[^\x00-\x7F]/g, '')
    const fileExt = sanitizedFileName.split('.').pop()
    const filePath = `${jobExists.id}/${crypto.randomUUID()}.${fileExt}`

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('invoices')
      .upload(filePath, file, {
        contentType: (file as File).type,
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(
        JSON.stringify({ error: 'Failed to upload file', details: uploadError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Create database record
    const { error: dbError } = await supabase
      .from('job_invoices')
      .insert({
        job_id: jobExists.id,
        filename: sanitizedFileName,
        file_path: filePath,
        amount: Number(amount),
        source: source || 'zapier',
        external_reference: externalReference,
        received_at: new Date().toISOString()
      })

    if (dbError) {
      console.error('Database error:', dbError);
      // If database insert fails, try to clean up the uploaded file
      await supabase.storage.from('invoices').remove([filePath])
      return new Response(
        JSON.stringify({ error: 'Failed to save invoice record', details: dbError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log('Successfully processed invoice:', {
      jobId: jobExists.id,
      amount,
      filename: sanitizedFileName,
      source
    });

    return new Response(
      JSON.stringify({ 
        message: 'Invoice processed successfully',
        filePath,
        jobId: jobExists.id,
        amount,
        source
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
