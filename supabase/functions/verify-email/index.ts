import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.10';
import { Resend } from "npm:resend@2.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { WelcomeEmail } from './_templates/welcome-email.tsx';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple in-memory rate limiting for token verification attempts
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  
  if (record.count >= RATE_LIMIT_MAX_ATTEMPTS) {
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

interface VerifyEmailRequest {
  token: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const clientIP = getClientIP(req);

  try {
    const { token }: VerifyEmailRequest = await req.json();

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Token is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Rate limit by IP and token combination
    const rateLimitKey = `${clientIP}:${token.substring(0, 8)}`;
    if (isRateLimited(rateLimitKey)) {
      console.log("Rate limit exceeded for verification attempt");
      return new Response(
        JSON.stringify({ error: "Too many verification attempts. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log("Processing email verification");

    // Try to verify the token using Supabase's built-in verification
    // The token from generateLink should be a valid OTP token
    const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'signup',
    });

    if (verifyError) {
      console.error("Verification failed:", verifyError);
      
      // Fall back to legacy pending_verifications table for backwards compatibility
      const { data: pendingVerification, error: findError } = await supabase
        .from('pending_verifications')
        .select('*')
        .eq('verification_token', token)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (findError || !pendingVerification) {
        return new Response(
          JSON.stringify({ error: "Invalid or expired verification token" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Legacy flow - user exists in pending_verifications
      // This path should eventually be deprecated
      console.log("Using legacy verification flow for:", pendingVerification.email);

      // Check if user already exists (someone may have verified already)
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(
        u => u.email?.toLowerCase() === pendingVerification.email.toLowerCase()
      );

      if (existingUser) {
        // User already exists, just confirm their email if not confirmed
        if (!existingUser.email_confirmed_at) {
          await supabase.auth.admin.updateUserById(existingUser.id, {
            email_confirm: true,
          });
        }
        
        // Clean up pending verification
        await supabase.from('pending_verifications').delete().eq('verification_token', token);
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Email verified successfully! You can now sign in.",
            userId: existingUser.id 
          }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Note: We can no longer create users from pending_verifications 
      // because we've removed plaintext password storage
      // Users must re-register through the new secure flow
      
      // Clean up the stale pending verification
      await supabase.from('pending_verifications').delete().eq('verification_token', token);
      
      return new Response(
        JSON.stringify({ 
          error: "This verification link is from an older registration. Please register again with a new account." 
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // New flow - Supabase OTP verification succeeded
    const user = verifyData.user;
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Verification failed - no user found" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Email verified for user:", user.id);

    // Send welcome email
    try {
      const userMetadata = user.user_metadata || {};
      const emailHtml = await renderAsync(
        React.createElement(WelcomeEmail, {
          firstName: userMetadata.first_name || 'User',
          userType: userMetadata.user_type || 'user',
          appUrl: new URL(req.url).origin
        })
      );

      await resend.emails.send({
        from: "TradeMate <noreply@hailodigital.co.uk>",
        to: [user.email!],
        subject: "Welcome to TradeMate - Your journey starts here!",
        html: emailHtml,
      });

      console.log("Welcome email sent to:", user.email);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the verification if email fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email verified successfully! Your account is now active. You can sign in.",
        userId: user.id 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in verify-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
