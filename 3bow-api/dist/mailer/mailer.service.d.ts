export declare class MailerService {
    private transporter;
    private ensureTransporter;
    sendOtp(to: string, code: string): Promise<void>;
    sendLoginLink(to: string, url: string): Promise<void>;
}
