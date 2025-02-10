
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file')
    const jobId = formData.get('jobId')
    const amount = formData.get('amount')
    const source = formData.get('source') || 'api'
    const externalReference = formData.get('externalReference')

    // Validate required fields
    if (!file || !jobId || !amount) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: file, jobId, and amount are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Sanitize filename and prepare file path
    const sanitizedFileName = (file as File).name.replace(/[^\x00-\x7F]/g, '')
    const fileExt = sanitizedFileName.split('.').pop()
    const filePath = `${jobId}/${crypto.randomUUID()}.${fileExt}`

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('invoices')
      .upload(filePath, file, {
        contentType: (file as File).type,
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return new Response(
        JSON.stringify({ error: 'Failed to upload file', details: uploadError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Create database record
    const { error: dbError } = await supabase
      .from('job_invoices')
      .insert({
        job_id: jobId,
        filename: sanitizedFileName,
        file_path: filePath,
        amount: Number(amount),
        source,
        external_reference: externalReference,
        received_at: new Date().toISOString()
      })

    if (dbError) {
      console.error('Database error:', dbError)
      // If database insert fails, try to clean up the uploaded file
      await supabase.storage.from('invoices').remove([filePath])
      return new Response(
        JSON.stringify({ error: 'Failed to save invoice record', details: dbError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: 'Invoice processed successfully',
        filePath,
        jobId 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
