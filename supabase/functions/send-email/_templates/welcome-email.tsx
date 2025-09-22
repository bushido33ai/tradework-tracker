import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface WelcomeEmailProps {
  firstName: string;
  userType: string;
  appUrl: string;
}

export const WelcomeEmail = ({
  firstName,
  userType,
  appUrl,
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to TradeMate - Your journey starts here!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src={appUrl ? `${appUrl}/lovable-uploads/new-trademate-logo.png` : "https://wsxicsgmjjmqefztultu.supabase.co/storage/v1/object/public/designs/new-trademate-logo.png"}
            width="200"
            height="auto"
            alt="TradeMate Logo"
            style={logo}
          />
        </Section>
        
        <Heading style={h1}>Welcome to TradeMate, {firstName}!</Heading>
        
        <Text style={text}>
          Thank you for joining TradeMate as a <strong>{userType}</strong>. We're excited to have you on board!
        </Text>
        
        <Section style={featureSection}>
          <Text style={subHeading}>What you can do with TradeMate:</Text>
          <Text style={bulletPoint}>• Manage building jobs and projects</Text>
          <Text style={bulletPoint}>• Track invoices and payments</Text>
          <Text style={bulletPoint}>• Organize customer information</Text>
          <Text style={bulletPoint}>• Upload and manage designs</Text>
          <Text style={bulletPoint}>• Monitor project budgets</Text>
        </Section>
        
        <Section style={ctaSection}>
          <Link
            href={`${appUrl}/signin`}
            style={button}
          >
            Get Started Now
          </Link>
        </Section>
        
        <Hr style={hr} />
        
        <Text style={footerText}>
          TradeMate is a <strong>FREE</strong> web/mobile/desktop application created by the team at{' '}
          <Link href="https://hailodigital.co.uk" style={link}>
            Hailo Digital
          </Link>
        </Text>
        
        <Text style={footerText}>
          Need help? Reply to this email or visit our support center.
        </Text>
        
        <Text style={disclaimer}>
          If you didn't create this account, you can safely ignore this email.
        </Text>
        
        <Section style={footerSection}>
          <Text style={companyFooter}>
            © 2025 Hailo Digital. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default WelcomeEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const logoContainer = {
  textAlign: 'center' as const,
  padding: '20px 0',
}

const logo = {
  margin: '0 auto',
}

const h1 = {
  color: '#1E40AF',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '24px 0',
  textAlign: 'center' as const,
}

const subHeading = {
  color: '#1E40AF',
  fontSize: '18px',
  fontWeight: '600',
  margin: '24px 0 16px',
  textAlign: 'center' as const,
}

const featureSection = {
  backgroundColor: '#f8fafc',
  padding: '24px',
  borderRadius: '8px',
  margin: '32px 0',
}

const bulletPoint = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '8px 0',
  paddingLeft: '20px',
}

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#1E40AF',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '32px 0',
}

const link = {
  color: '#1E40AF',
  textDecoration: 'underline',
}

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '16px 0',
  textAlign: 'center' as const,
}

const disclaimer = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '24px 0',
  textAlign: 'center' as const,
}

const footerSection = {
  textAlign: 'center' as const,
  margin: '32px 0 0',
}

const companyFooter = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: '0',
}