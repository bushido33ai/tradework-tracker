import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.10';
import { Resend } from "npm:resend@2.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { WelcomeEmail } from '../send-email/_templates/welcome-email.tsx';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyEmailRequest {
  token: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token }: VerifyEmailRequest = await req.json();

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Token is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log("Verifying email with token:", token);

    // Find the pending verification
    const { data: pendingVerification, error: findError } = await supabase
      .from('pending_verifications')
      .select('*')
      .eq('verification_token', token)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (findError || !pendingVerification) {
      console.error("Verification not found or expired:", findError);
      return new Response(
        JSON.stringify({ error: "Invalid or expired verification token" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Found pending verification:", pendingVerification);

    // Create the actual user account using the admin client
    const { data: signUpData, error: signUpError } = await supabase.auth.admin.createUser({
      email: pendingVerification.email,
      password: pendingVerification.password_hash,
      email_confirm: true, // Skip email confirmation since we're doing it manually
      user_metadata: {
        user_type: pendingVerification.user_type,
        address: pendingVerification.address,
        telephone: pendingVerification.telephone,
        email: pendingVerification.email,
        first_name: pendingVerification.first_name,
        surname: pendingVerification.surname,
      },
    });

    if (signUpError) {
      console.error("Failed to create user:", signUpError);
      return new Response(
        JSON.stringify({ error: "Failed to create account: " + signUpError.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("User created successfully:", signUpData.user?.id);

    // Send welcome email
    try {
      const emailHtml = await renderAsync(
        React.createElement(WelcomeEmail, {
          firstName: pendingVerification.first_name,
          userType: pendingVerification.user_type,
          appUrl: new URL(req.url).origin
        })
      );

      const emailResponse = await resend.emails.send({
        from: "TradeMate <noreply@hailodigital.co.uk>",
        to: [pendingVerification.email],
        subject: "Welcome to TradeMate - Your journey starts here!",
        html: emailHtml,
      });

      console.log("Welcome email sent successfully:", emailResponse);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the verification if email fails
    }

    // Delete the pending verification
    const { error: deleteError } = await supabase
      .from('pending_verifications')
      .delete()
      .eq('verification_token', token);

    if (deleteError) {
      console.error("Failed to delete pending verification:", deleteError);
      // Don't fail the request since the user was created successfully
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email verified successfully! Your account has been created and a welcome email has been sent. You can now sign in.",
        userId: signUpData.user?.id 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in verify-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);