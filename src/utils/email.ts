
import { supabase } from "@/integrations/supabase/client";

interface SendEmailParams {
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

export const sendEmail = async ({ to, subject, html, template, templateData }: SendEmailParams) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: { to, subject, html, template, templateData }
    });

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error sending email:', error);
    throw error;
  }
};
