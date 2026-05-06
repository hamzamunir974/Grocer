import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: this.configService.get('MAIL_PORT') === 465,
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS'),
      },
    });
  }

  async sendPin(email: string, pin: string) {
    const mailOptions = {
      from: `"GrocerX Support" <${this.configService.get('MAIL_USER')}>`,
      to: email,
      subject: 'Your GrocerX Verification PIN',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #FF7A01; text-align: center;">Welcome to GrocerX! 🛒</h2>
          <p>Hi there,</p>
          <p>Thank you for choosing GrocerX. To complete your registration, please use the following 6-digit PIN:</p>
          <div style="background: #FDF4EB; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #FF7A01; border-radius: 8px; margin: 20px 0;">
            ${pin}
          </div>
          <p style="font-size: 14px; color: #666;">This PIN will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">&copy; ${new Date().getFullYear()} GrocerX. Fresh Groceries Delivered.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Real Email sent to ${email}`);
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      // Fallback to console for viva safety
      console.log(`\n📧 [FALLBACK PIN] for ${email}: ${pin}\n`);
    }
  }
}
