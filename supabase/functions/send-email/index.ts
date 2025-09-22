
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { WelcomeEmail } from './_templates/welcome-email.tsx';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  html?: string;
  template?: 'welcome';
  templateData?: {
    firstName: string;
    userType: string;
    appUrl: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html, template, templateData }: EmailRequest = await req.json();

    console.log("Sending email to:", to);

    let emailHtml = html;
    let attachments: any[] | undefined = undefined;

    // If template is specified, render it
    if (template === 'welcome' && templateData) {
      emailHtml = await renderAsync(
        React.createElement(WelcomeEmail, templateData)
      );

      // Embed logo as inline image for reliable rendering in email clients
      const logoFromApp = templateData.appUrl
        ? `${templateData.appUrl}/lovable-uploads/342506cf-411e-4195-9c10-5f806c52d3b7.png`
        : undefined;
      const logoFallback = 'https://wsxicsgmjjmqefztultu.supabase.co/storage/v1/object/public/designs/342506cf-411e-4195-9c10-5f806c52d3b7.png';
      const logoPath = logoFromApp || logoFallback;

      attachments = [
        {
          path: logoPath,
          filename: 'trademate-logo.png',
          content_id: 'trademate-logo',
          content_type: 'image/png',
        },
      ];
    }

    const emailResponse = await resend.emails.send({
      from: "TradeMate <noreply@hailodigital.co.uk>",
      to: [to],
      subject: subject,
      html: emailHtml,
      ...(attachments ? { attachments } : {}),
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
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
