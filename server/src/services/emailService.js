import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html, text }) => {
  const provider = process.env.EMAIL_PROVIDER || 'console';
  const from = process.env.EMAIL_FROM || 'COSMOS TechBlitz <techblitz@jec.ac.in>';

  if (provider === 'console') {
    console.log(`\n=================== [EMAIL SERVICE (CONSOLE)] ===================`);
    console.log(`TO: ${to}`);
    console.log(`FROM: ${from}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`HTML BODY:\n${html}`);
    console.log(`=================================================================\n`);
    return { success: true, messageId: 'console-mock-id' };
  }

  if (provider === 'smtp') {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const info = await transporter.sendMail({
        from,
        to,
        subject,
        text: text || subject,
        html,
      });

      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('[EmailService] SMTP Error:', error);
      return { success: false, error: error.message };
    }
  }

  // Fallback log
  console.log(`[EmailService] Provider '${provider}' triggered for ${to}: ${subject}`);
  return { success: true };
};

export const getRegistrationEmailTemplate = (name, workshopTitle, date, time) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0d0d12; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #7b61ff; letter-spacing: 2px; margin: 0;">TECHBLITZ 2.0</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">COSMOS • Jabalpur Engineering College</p>
      </div>
      <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
        <h2 style="color: #4ade80; margin-top: 0;">🎉 Registration Confirmed!</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Your registration for the workshop <strong>${workshopTitle}</strong> has been successfully confirmed.</p>
        <div style="margin: 20px 0; padding: 15px; background: rgba(123, 97, 255, 0.1); border-left: 4px solid #7b61ff; border-radius: 4px;">
          <p style="margin: 4px 0;"><strong>Date:</strong> ${date}</p>
          <p style="margin: 4px 0;"><strong>Time:</strong> ${time}</p>
        </div>
        <p>You can access the live session link directly from your TechBlitz participant dashboard once the workshop begins.</p>
      </div>
      <div style="text-align: center; margin-top: 25px; color: #64748b; font-size: 12px;">
        <p>COSMOS Technical Club • Building the Future</p>
      </div>
    </div>
  `;
};
