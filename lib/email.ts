import { SES } from '@aws-sdk/client-ses';

// Initialize the SES client
const ses = new SES({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

type EmailParams = {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  text?: string;
};

/**
 * Send an email using Amazon SES
 */
export async function sendEmail({ to, subject, html, from, text }: EmailParams) {
  const fromAddress = from || process.env.EMAIL_FROM || 'myletter@expanse.so';
  const toAddresses = Array.isArray(to) ? to : [to];
  
  try {
    const result = await ses.sendEmail({
      Source: fromAddress,
      Destination: {
        ToAddresses: toAddresses,
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: html,
            Charset: 'UTF-8',
          },
          ...(text && {
            Text: {
              Data: text,
              Charset: 'UTF-8',
            },
          }),
        },
      },
    });
    
    return {
      success: true,
      messageId: result.MessageId,
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error,
    };
  }
}

/**
 * Send a welcome email to a new user
 */
export async function sendWelcomeEmail(email: string, name: string) {
  return sendEmail({
    to: email,
    subject: 'Welcome to MyLetter',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Welcome to MyLetter, ${name}!</h1>
        <p>We're excited to have you on board. MyLetter makes it easy to create and send newsletters to your audience.</p>
        <p>To get started, simply create your first newsletter by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://myletter.expanse.so'}/dashboard/new" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Create Your First Newsletter</a>
        </div>
        <p>If you have any questions, just reply to this email - we're here to help!</p>
        <p>Best regards,<br>The MyLetter Team</p>
      </div>
    `,
    text: `Welcome to MyLetter, ${name}!\n\nWe're excited to have you on board. MyLetter makes it easy to create and send newsletters to your audience.\n\nTo get started, simply create your first newsletter by visiting: ${process.env.NEXT_PUBLIC_BASE_URL || 'https://myletter.expanse.so'}/dashboard/new\n\nIf you have any questions, just reply to this email - we're here to help!\n\nBest regards,\nThe MyLetter Team`,
  });
}

/**
 * Send a newsletter to a subscriber
 */
export async function sendNewsletter(
  subscriberEmail: string, 
  newsletterHtml: string, 
  newsletterText: string,
  subject: string
) {
  return sendEmail({
    to: subscriberEmail,
    subject,
    html: newsletterHtml,
    text: newsletterText,
  });
}