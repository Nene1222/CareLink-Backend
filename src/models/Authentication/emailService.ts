// lib/emailService.ts
import nodemailer from 'nodemailer';

// Configure your email service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Use app password for Gmail
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    // Verify transporter configuration
    await transporter.verify();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"CareLink Clinic" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', options.to);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

export const sendOTPEmail = async (email: string, otp: string, type: 'registration' | 'password-reset'): Promise<boolean> => {
  const subject = type === 'registration' 
    ? 'Verify Your Email - CareLink Clinic'
    : 'Password Reset OTP - CareLink Clinic';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
        <h1>CareLink Clinic Management</h1>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2>${type === 'registration' ? 'Verify Your Email Address' : 'Reset Your Password'}</h2>
        <p>Dear User,</p>
        <p>Your verification code is:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #667eea;">
            ${otp}
          </div>
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
      <div style="background: #333; color: white; padding: 20px; text-align: center;">
        <p>&copy; 2024 CareLink Clinic Management. All rights reserved.</p>
      </div>
    </div>
  `;

  return await sendEmail({ to: email, subject, html });
};