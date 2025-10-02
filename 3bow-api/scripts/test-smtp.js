const nodemailer = require('nodemailer');

async function main() {
  const t = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const info = await t.sendMail({
    to: process.env.SMTP_USER,            // gửi về chính Gmail của bạn
    from: `"3BOW Test" <${process.env.SMTP_USER}>`,
    subject: "Test SMTP 3BOW",
    text: "OK!",
  });

  console.log("Sent:", info.messageId);
}

main().catch(console.error);
