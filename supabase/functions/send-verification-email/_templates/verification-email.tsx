import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface VerificationEmailProps {
  firstName: string;
  userType: string;
  verificationUrl: string;
}

export const VerificationEmail = ({
  firstName,
  userType,
  verificationUrl,
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify your email to complete your TradeMate account setup</Preview>
    <Body style={main}>
      <Container style={container}>
        
        <Heading style={h1}>Verify Your Email Address</Heading>
        
        <Text style={text}>
          Hi {firstName},
        </Text>
        
        <Text style={text}>
          Thank you for signing up for TradeMate as a {userType}! To complete your account setup and start using our platform, please verify your email address.
        </Text>
        
        <Section style={buttonContainer}>
          <Button
            style={button}
            href={verificationUrl}
          >
            Verify Email Address
          </Button>
        </Section>
        
        <Text style={text}>
          Once verified, you'll be able to sign in and access all TradeMate features including:
        </Text>
        
        <Text style={bulletList}>
          • Job management and tracking<br />
          • Customer and supplier management<br />
          • File storage and organization<br />
          • Professional dashboard and reporting
        </Text>
        
        <Text style={warningText}>
          This verification link will expire in 24 hours. If you didn't create this account, you can safely ignore this email.
        </Text>
        
        <Text style={footerText}>
          Need help? Contact our support team or visit our help center.
        </Text>
        
        <Text style={footer}>
          Best regards,<br />
          The TradeMate Team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default VerificationEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const h1 = {
  color: '#1E40AF',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
  padding: '0 40px',
};

const bulletList = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
  padding: '0 40px',
  marginLeft: '20px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#1E40AF',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
  margin: '0 auto',
};

const warningText = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '24px 0',
  padding: '16px 40px',
  backgroundColor: '#f8f9fa',
  borderLeft: '4px solid #fbbf24',
};

const footerText = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '32px 0 16px',
  padding: '0 40px',
};

const footer = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '16px 0',
  padding: '0 40px',
};