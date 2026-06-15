const nodemailer = require('nodemailer');

// MVP Email Service using standard SMTP (e.g., Gmail App Passwords)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your preferred SMTP
  auth: {
    user: process.env.EMAIL_USER || 'test@example.com',
    pass: process.env.EMAIL_PASS || 'password123'
  }
});

const sendCertificateEmail = async (studentEmail, studentName, certificateUrl, org) => {
  if (!studentEmail) return;

  const orgName = org.name || 'AuthPulse';
  const orgLogo = org.logo ? `<img src="${org.logo}" alt="${orgName} Logo" style="max-height: 60px; margin-bottom: 20px;" />` : '';
  const brandColor = org.brandColor || '#007bff';

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: studentEmail,
    subject: `Your Certificate from ${orgName} is Ready!`,
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 40px 20px; max-width: 600px; margin: 0 auto; background-color: #f8fafc; border-radius: 8px;">
        ${orgLogo}
        <h2 style="color: #1e293b;">Congratulations, ${studentName}!</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.5;">${orgName} has officially issued your verified credential.</p>
        <div style="margin: 30px 0;">
          <a href="${certificateUrl}" style="display: inline-block; padding: 12px 24px; background-color: ${brandColor}; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">View Your Certificate</a>
        </div>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 40px;">
          Secured and verified by <a href="https://authpulse.com" style="color: #94a3b8;">AuthPulse</a>.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${studentEmail}`);
  } catch (error) {
    console.error(`Failed to send email to ${studentEmail}:`, error.message);
  }
};

module.exports = {
  sendCertificateEmail
};
