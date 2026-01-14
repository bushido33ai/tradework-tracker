import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.10';

// Restrict CORS to known origins - configure via ALLOWED_ORIGINS env var
const ALLOWED_ORIGINS = Deno.env.get("ALLOWED_ORIGINS")?.split(",") || [];

function getCorsHeaders(origin: string | null): Record<string, string> {
  // If no origins configured, allow all (backwards compatibility)
  const allowAll = ALLOWED_ORIGINS.length === 0;
  const isAllowed = allowAll || (origin && ALLOWED_ORIGINS.includes(origin));
  
  return {
    "Access-Control-Allow-Origin": isAllowed && origin ? origin : (allowAll ? "*" : ALLOWED_ORIGINS[0] || "*"),
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-api-key",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

// Rate limiting for API key validation
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX_REQUESTS = 100;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }
  
  record.count++;
  return false;
}

// Get client IP for rate limiting
function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
         req.headers.get('x-real-ip') || 
         'unknown';
}

// Extract job ID from email subject - improved patterns
function extractJobIdFromString(input: string): string | null {
  const patterns = [
    /JOB-(\d{4})/i,
    /JobID\s*(\d+)/i,
    /job\s*#?\s*(\d{4})/i,
    /job\s*number\s*:?\s*(\d{4})/i,
  ];
  
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

// Extract amount from email subject - improved patterns
function extractAmountFromString(input: string): number | null {
  const patterns = [
    /£\s*([\d,]+(?:\.\d{2})?)/,
    /\$([\d,]+(?:\.\d{2})?)/,
    /€\s*([\d,]+(?:\.\d{2})?)/,
    /([\d,]+(?:\.\d{2})?)\s*(?:GBP|USD|EUR)/i,
    /amount\s*:?\s*([\d,]+(?:\.\d{2})?)/i,
    /total\s*:?\s*([\d,]+(?:\.\d{2})?)/i,
  ];
  
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) {
      const amount = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(amount) && amount > 0) {
        return amount;
      }
    }
  }
  return null;
}

// Constant-time string comparison to prevent timing attacks
function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
    );
  }

  const clientIP = getClientIP(req);

  try {
    // Rate limit by IP first (before API key validation to prevent brute force)
    if (isRateLimited(`ip:${clientIP}`)) {
      console.log('Rate limit exceeded for IP');
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
      );
    }

    // Validate API key
    const apiKey = req.headers.get('x-api-key');
    const expectedApiKey = Deno.env.get('INVOICE_INGESTION_API_KEY');

    if (!apiKey) {
      console.log('No API key provided in request');
      return new Response(
        JSON.stringify({ error: 'Unauthorized - API key required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    if (!expectedApiKey) {
      console.error('INVOICE_INGESTION_API_KEY not set in environment');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Use constant-time comparison to prevent timing attacks
    if (!secureCompare(apiKey, expectedApiKey)) {
      console.log('Invalid API key provided');
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid API key' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Rate limit by API key as well
    if (isRateLimited(`apikey:${apiKey.substring(0, 8)}`)) {
      console.log('Rate limit exceeded for API key');
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
      );
    }

    console.log('API key validated successfully');

    const formData = await req.formData();
    let jobId = formData.get('jobId')?.toString();
    let amount = formData.get('amount')?.toString();
    const file = formData.get('file') as File | null;
    const source = formData.get('source')?.toString() || 'api';
    const externalReference = formData.get('externalReference')?.toString();
    const emailSubject = formData.get('emailSubject')?.toString();

    // If jobId or amount not provided directly, try to extract from email subject
    if (emailSubject) {
      console.log('Processing email subject');
      if (!jobId) {
        jobId = extractJobIdFromString(emailSubject);
        if (jobId) console.log('Extracted jobId from subject');
      }
      if (!amount) {
        const extractedAmount = extractAmountFromString(emailSubject);
        if (extractedAmount) {
          amount = extractedAmount.toString();
          console.log('Extracted amount from subject');
        }
      }
    }

    // Validate required fields
    if (!file) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: file' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (!jobId) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: jobId (not provided or could not be extracted)' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (!amount) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: amount (not provided or could not be extracted)' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount - must be a positive number' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid file type. Allowed: PDF, JPEG, PNG, GIF' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return new Response(
        JSON.stringify({ error: 'File too large. Maximum size is 10MB' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify job exists - handle both formats (with and without JOB- prefix)
    const jobNumber = jobId.startsWith('JOB-') ? jobId : `JOB-${jobId.padStart(4, '0')}`;
    
    const { data: jobExists, error: jobError } = await supabase
      .from('jobs')
      .select('id, job_number')
      .eq('job_number', jobNumber)
      .single();

    if (jobError || !jobExists) {
      console.log('Job not found:', jobNumber);
      return new Response(
        JSON.stringify({ error: `Job not found: ${jobNumber}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    console.log('Found job:', jobExists.id);

    // Sanitize filename and prepare file path
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const timestamp = Date.now();
    const filePath = `${jobExists.id}/${timestamp}_${sanitizedFileName}`;

    // Upload file to storage
    const fileBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from('invoices')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError.message);
      return new Response(
        JSON.stringify({ error: 'Failed to upload file' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log('File uploaded:', filePath);

    // Create database record
    const { data: invoice, error: dbError } = await supabase
      .from('job_invoices')
      .insert({
        job_id: jobExists.id,
        filename: sanitizedFileName,
        file_path: filePath,
        amount: parsedAmount,
        source: source,
        external_reference: externalReference || null,
        received_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError.message);
      // If database insert fails, try to clean up the uploaded file
      await supabase.storage.from('invoices').remove([filePath]);
      return new Response(
        JSON.stringify({ error: 'Failed to save invoice record' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log('Invoice created:', invoice?.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Invoice processed successfully',
        invoiceId: invoice?.id,
        jobNumber: jobExists.job_number,
        amount: parsedAmount,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
