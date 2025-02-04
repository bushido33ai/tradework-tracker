import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  type: 'new_request' | 'approved' | 'rejected';
  userName?: string;
  trialEndDate?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, type, userName, trialEndDate }: EmailRequest = await req.json();

    let subject = '';
    let html = '';

    switch (type) {
      case 'new_request':
        subject = 'New Access Request Received';
        html = `
          <h1>New Access Request</h1>
          <p>A new access request has been received from ${userName}.</p>
          <p>Please review this request in the admin dashboard.</p>
        `;
        break;
      case 'approved':
        subject = 'Your Access Request has been Approved!';
        html = `
          <h1>Access Request Approved</h1>
          <p>Dear ${userName},</p>
          <p>Your access request has been approved!</p>
          ${trialEndDate ? `<p>Your trial period will end on ${trialEndDate}.</p>` : ''}
          <p>You can now access all features of the platform.</p>
        `;
        break;
      case 'rejected':
        subject = 'Access Request Status Update';
        html = `
          <h1>Access Request Update</h1>
          <p>Dear ${userName},</p>
          <p>We regret to inform you that your access request could not be approved at this time.</p>
          <p>If you believe this is an error, please contact our support team.</p>
        `;
        break;
    }

    const emailResponse = await resend.emails.send({
      from: "TradeMate <onboarding@resend.dev>",
      to: [to],
      subject: subject,
      html: html,
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
    console.error("Error in send-access-request-email function:", error);
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