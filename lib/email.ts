import nodemailer from 'nodemailer'
import { logError } from './logger'

/**
 * Email service for sending notifications
 * Supports multiple providers (SMTP, SendGrid, etc.)
 */

// Create reusable transporter
let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (transporter) {
    return transporter
  }

  // Configure based on environment variables
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    // Custom SMTP server
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  } else if (process.env.SENDGRID_API_KEY) {
    // SendGrid
    transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    })
  } else if (process.env.RESEND_API_KEY) {
    // Resend
    transporter = nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 587,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY,
      },
    })
  } else {
    // Development mode - log to console only
    console.warn('No email service configured. Emails will be logged to console.')
    return null
  }

  return transporter
}

/**
 * Send email notification
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html: string
  text?: string
}): Promise<{ success: boolean; error?: string }> {
  const transporter = getTransporter()

  if (!transporter) {
    // Development mode - just log
    console.log('📧 Email (not sent, no service configured):')
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log(`Body: ${text || html}`)
    return { success: true }
  }

  try {
    const from = process.env.EMAIL_FROM || 'noreply@looply.app'

    await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    })

    return { success: true }
  } catch (error) {
    logError(error, { context: 'sendEmail', to, subject })
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send form response notification to form owner
 */
export async function sendFormResponseNotification({
  formTitle,
  formId,
  responseId,
  ownerEmail,
  submitterEmail,
  responseCount,
}: {
  formTitle: string
  formId: string
  responseId: string
  ownerEmail: string
  submitterEmail?: string
  responseCount: number
}) {
  const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const viewResponseUrl = `${appUrl}/dashboard/forms/${formId}/responses`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .stats { background: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 New Form Response!</h1>
          </div>
          <div class="content">
            <h2>You received a new response for "${formTitle}"</h2>

            <div class="stats">
              <p><strong>📊 Total responses:</strong> ${responseCount}</p>
              ${submitterEmail ? `<p><strong>👤 Submitted by:</strong> ${submitterEmail}</p>` : ''}
              <p><strong>🕒 Received:</strong> ${new Date().toLocaleString()}</p>
            </div>

            <p>Click the button below to view all responses:</p>

            <a href="${viewResponseUrl}" class="button">View Responses</a>

            <p style="margin-top: 30px; font-size: 14px; color: #666;">
              Or copy this link: <br>
              <a href="${viewResponseUrl}">${viewResponseUrl}</a>
            </p>
          </div>
          <div class="footer">
            <p>This notification was sent from Looply</p>
            <p>To disable notifications, update your form settings</p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: ownerEmail,
    subject: `New response for "${formTitle}"`,
    html,
  })
}

/**
 * Send form submission confirmation to submitter
 */
export async function sendSubmissionConfirmation({
  formTitle,
  submitterEmail,
  confirmationMessage,
}: {
  formTitle: string
  submitterEmail: string
  confirmationMessage?: string
}) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Form Submitted Successfully!</h1>
          </div>
          <div class="content">
            <h2>Thank you for your submission</h2>
            <p>Your response to "<strong>${formTitle}</strong>" has been recorded.</p>

            ${confirmationMessage ? `
              <div style="background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0;">
                ${confirmationMessage}
              </div>
            ` : ''}

            <p style="margin-top: 30px; font-size: 14px; color: #666;">
              Submitted on ${new Date().toLocaleString()}
            </p>
          </div>
          <div class="footer">
            <p>Powered by Looply</p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: submitterEmail,
    subject: `Confirmation: ${formTitle}`,
    html,
  })
}

/**
 * Verify email configuration
 */
export async function verifyEmailConfig(): Promise<boolean> {
  const transporter = getTransporter()

  if (!transporter) {
    return false
  }

  try {
    await transporter.verify()
    return true
  } catch (error) {
    logError(error, { context: 'verifyEmailConfig' })
    return false
  }
}
