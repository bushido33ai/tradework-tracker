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

    console.log("Sending verification email to:", email);

    // Initialize Supabase client with service role key
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if user already exists
    const { data: existingUser } = await supabase.auth.admin.getUserByEmail(email);
    if (existingUser.user) {
      return new Response(
        JSON.stringify({ error: "An account with this email already exists" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Hash the password (using a simple approach for demo)
    const hashedPassword = password; // In production, use proper hashing

    // Store pending verification
    const { data: pendingData, error: insertError } = await supabase
      .from('pending_verifications')
      .insert({
        email: email.toLowerCase().trim(),
        password_hash: hashedPassword,
        first_name: firstName.trim(),
        surname: surname.trim(),
        address: address.trim(),
        telephone: telephone.trim(),
        user_type: userType,
      })
      .select('verification_token')
      .single();

    if (insertError) {
      console.error("Failed to create pending verification:", insertError);
      
      if (insertError.code === '23505') { // Unique constraint violation
        return new Response(
          JSON.stringify({ error: "A verification request for this email is already pending" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
      
      throw insertError;
    }

    console.log("Created pending verification with token:", pendingData.verification_token);

    // Render verification email
    const emailHtml = await renderAsync(
      React.createElement(VerificationEmail, {
        firstName,
        userType,
        verificationUrl: `${appUrl}/verify-email?token=${pendingData.verification_token}`,
      })
    );

    // Send verification email
    const emailResponse = await resend.emails.send({
      from: "TradeMate <noreply@hailodigital.co.uk>",
      to: [email],
      subject: "Verify your email - TradeMate Account",
      html: emailHtml,
    });

    console.log("Verification email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Verification email sent! Please check your inbox and click the verification link to activate your account." 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-verification-email function:", error);
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