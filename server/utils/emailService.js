const nodemailer = require('nodemailer');

// MVP Email Service using standard SMTP (e.g., Gmail App Passwords)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your preferred SMTP
  auth: {
    user: process.env.EMAIL_USER || 'test@example.com',
    pass: process.env.EMAIL_PASS || 'password123'
  }
});

const sendCertificateEmail = async (studentEmail, studentName, certificateUrl, orgName) => {
  if (!studentEmail) return;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: studentEmail,
    subject: `Your Certificate from ${orgName} is Ready!`,
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h2>Congratulations, ${studentName}!</h2>
        <p>${orgName} has issued your official verified certificate.</p>
        <p>You can view and verify your credential here:</p>
        <a href="${certificateUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">View Certificate</a>
        <br/><br/>
        <p>Securely verified by AuthPulse.</p>
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
