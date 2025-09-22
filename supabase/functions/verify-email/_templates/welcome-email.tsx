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
        
        <Heading style={h1}>Welcome to TradeMate, {firstName}!</Heading>
        
        <Text style={text}>
          Congratulations! Your {userType} account has been successfully created and verified. 
          You're now ready to streamline your trade business with TradeMate.
        </Text>
        
        <Section style={featuresSection}>
          <Heading style={h2}>What you can do with TradeMate:</Heading>
          
          <div style={featureItem}>
            <Text style={featureTitle}>📋 Job Management</Text>
            <Text style={featureDescription}>
              Create, track, and manage all your jobs from start to finish. Monitor progress, 
              update statuses, and keep everything organized in one place.
            </Text>
          </div>
          
          <div style={featureItem}>
            <Text style={featureTitle}>👥 Customer & Supplier Management</Text>
            <Text style={featureDescription}>
              Store and manage all your customer and supplier information. Quick access to 
              contact details, project history, and preferences.
            </Text>
          </div>
          
          <div style={featureItem}>
            <Text style={featureTitle}>📁 File Storage & Organization</Text>
            <Text style={featureDescription}>
              Upload and organize project files, designs, invoices, and documents. 
              Everything is securely stored and easily accessible.
            </Text>
          </div>
          
          <div style={featureItem}>
            <Text style={featureTitle}>📊 Professional Dashboard</Text>
            <Text style={featureDescription}>
              Get insights into your business with comprehensive reporting, 
              profit tracking, and performance analytics.
            </Text>
          </div>
          
          <div style={featureItem}>
            <Text style={featureTitle}>📅 Work Calendar</Text>
            <Text style={featureDescription}>
              Schedule jobs, track deadlines, and manage your time efficiently 
              with our integrated calendar system.
            </Text>
          </div>
        </Section>
        
        <Section style={buttonContainer}>
          <Button
            style={button}
            href={`${appUrl}/signin`}
          >
            Sign In to TradeMate
          </Button>
        </Section>
        
        <Text style={footerText}>
          Need help getting started? Check out our help center or contact our support team.
        </Text>
        
        <Text style={footer}>
          Best regards,<br />
          The TradeMate Team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

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

const h2 = {
  color: '#1E40AF',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '32px 0 24px',
  padding: '0 40px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
  padding: '0 40px',
};

const featuresSection = {
  margin: '32px 0',
};

const featureItem = {
  margin: '24px 0',
  padding: '0 40px',
};

const featureTitle = {
  color: '#1E40AF',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const featureDescription = {
  color: '#555',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px 0',
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