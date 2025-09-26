"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerService = void 0;
const common_1 = require("@nestjs/common");
let _nm;
try {
    _nm = require('nodemailer');
}
catch {
}
const nmMaybe = _nm?.default ?? _nm;
let MailerService = class MailerService {
    constructor() {
        this.transporter = null;
    }
    async ensureTransporter() {
        if (this.transporter)
            return this.transporter;
        let nodemailer = nmMaybe;
        if (!nodemailer) {
            const mod = await Promise.resolve().then(() => __importStar(require('nodemailer')));
            nodemailer = mod.default ?? mod;
        }
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: String(process.env.SMTP_PORT || '587') === '465',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        return this.transporter;
    }
    async sendOtp(to, code) {
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
    async sendLoginLink(to, url) {
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
};
exports.MailerService = MailerService;
exports.MailerService = MailerService = __decorate([
    (0, common_1.Injectable)()
], MailerService);
//# sourceMappingURL=mailer.service.js.map