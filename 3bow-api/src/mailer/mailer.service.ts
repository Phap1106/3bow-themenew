import { Injectable } from '@nestjs/common';

// Shim CJS/ESM cho nodemailer
let _nm: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  _nm = require('nodemailer');
} catch {
  // ignore
}
const nmMaybe: any = _nm?.default ?? _nm;

@Injectable()
export class MailerService {
  private transporter: any | null = null;

  private async ensureTransporter() {
    if (this.transporter) return this.transporter;

    // Nếu require fail (nmMaybe undefined), thử dynamic import (ESM)
    let nodemailer: any = nmMaybe;
    if (!nodemailer) {
      const mod = await import('nodemailer');
      nodemailer = (mod as any).default ?? mod;
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_PORT || '587') === '465', // 465 = SSL
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });

    return this.transporter;
  }

  // === GỬI MÃ OTP (6 số) ===
  async sendOtp(to: string, code: string) {
    const transporter = await this.ensureTransporter();
    const from = process.env.MAIL_FROM || `3BOW Auth <${process.env.SMTP_USER}>`;

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
        <h2 style="margin:0 0 8px">Mã xác minh đăng nhập</h2>
        <p>Nhập mã bên dưới để hoàn tất đăng nhập (hiệu lực 15 phút):</p>
        <div style="font-size:28px;letter-spacing:6px;font-weight:700;padding:12px 16px;border:1px solid #eee;border-radius:12px;text-align:center">
          ${code}
        </div>
        <p style="color:#666;font-size:12px;margin-top:10px">Nếu bạn không thực hiện, hãy bỏ qua email này.</p>
      </div>
    `;

    await transporter.sendMail({ to, from, subject: 'Mã xác minh đăng nhập', html });
  }

  // === (Tuỳ chọn) GỬI LINK VERIFY ===
  async sendLoginLink(to: string, url: string) {
    const transporter = await this.ensureTransporter();
    const from = process.env.MAIL_FROM || `3BOW Auth <${process.env.SMTP_USER}>`;
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
        <h2>Đăng nhập 3BOW</h2>
        <p>Nhấn nút để hoàn tất đăng nhập:</p>
        <p><a href="${url}" style="display:inline-block;background:#111;color:#fff;padding:10px 16px;border-radius:10px;text-decoration:none">Đăng nhập</a></p>
        <p>Nếu không bấm được, dùng liên kết: <br>${url}</p>
        <p style="color:#666;font-size:12px">Liên kết có hiệu lực 15 phút.</p>
      </div>
    `;
    await transporter.sendMail({ to, from, subject: 'Xác minh đăng nhập 3BOW', html });
  }
}
