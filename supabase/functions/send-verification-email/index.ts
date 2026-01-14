import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.10';
import { VerificationEmail } from './_templates/verification-email.tsx';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX_REQUESTS = 3;
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

interface SendVerificationEmailRequest {
  email: string;
  password: string;
  firstName: string;
  surname: string;
  address: string;
  telephone: string;
  userType: string;
  appUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      email, 
      password, 
      firstName, 
      surname, 
      address, 
      telephone, 
      userType,
      appUrl 
    }: SendVerificationEmailRequest = await req.json();

    // Input validation
    if (!email || !password || !firstName || !surname || !userType) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const cleanedEmail = email.toLowerCase().trim();

    // Rate limiting by email
    if (isRateLimited(cleanedEmail)) {
      console.log("Rate limit exceeded for email:", cleanedEmail);
      return new Response(
        JSON.stringify({ error: "Too many signup attempts. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Processing signup for:", cleanedEmail);

    // Initialize Supabase client with service role key
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if user already exists
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const userExists = existingUser?.users?.some(u => u.email?.toLowerCase() === cleanedEmail);

    if (userExists) {
      return new Response(
        JSON.stringify({ error: "An account with this email already exists" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create user with Supabase Auth - password is securely hashed by Supabase
    // User is created with email_confirm: false so they must verify
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email: cleanedEmail,
      password: password, // Supabase handles secure bcrypt hashing internally
      email_confirm: false, // User must confirm email
      user_metadata: {
        user_type: userType,
        address: address.trim(),
        telephone: telephone.trim(),
        email: cleanedEmail,
        first_name: firstName.trim(),
        surname: surname.trim(),
      },
    });

    if (createError) {
      console.error("Failed to create user:", createError);
      
      if (createError.message.includes("already been registered")) {
        return new Response(
          JSON.stringify({ error: "An account with this email already exists" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      
      throw createError;
    }

    console.log("User created with ID:", userData.user?.id);

    // Generate email confirmation link using Supabase's built-in method
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'signup',
      email: cleanedEmail,
      options: {
        redirectTo: `${appUrl}/signin?verified=true`,
      }
    });

    if (linkError) {
      console.error("Failed to generate verification link:", linkError);
      // Clean up the created user since we can't send verification
      await supabase.auth.admin.deleteUser(userData.user!.id);
      throw linkError;
    }

    // Extract the token from the generated link
    const verificationUrl = linkData.properties?.action_link || `${appUrl}/verify-email?token=${linkData.properties?.hashed_token}`;

    console.log("Generated verification URL");

    // Render custom verification email
    const emailHtml = await renderAsync(
      React.createElement(VerificationEmail, {
        firstName: firstName.trim(),
        userType,
        verificationUrl,
      })
    );

    // Send verification email via Resend
    const emailResponse = await resend.emails.send({
      from: "TradeMate <noreply@hailodigital.co.uk>",
      to: [cleanedEmail],
      subject: "Verify your email - TradeMate Account",
      html: emailHtml,
    });

    console.log("Verification email sent:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Verification email sent! Please check your inbox and click the verification link to activate your account." 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    const correlationId = crypto.randomUUID();
    console.error(`[${correlationId}] Error in send-verification-email function:`, error);
    return new Response(
      JSON.stringify({ 
        error: "An unexpected error occurred. Please try again later.",
        correlationId 
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
