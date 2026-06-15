const cron = require('node-cron');
const Certificate = require('../models/Certificate');
const Organization = require('../models/Organization');
const { sendExpirationEmail } = require('../utils/emailService');

// Run every day at midnight
const startExpirationCron = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily expiration check cron job...');
    try {
      const today = new Date();
      // Target: Exactly 7 days from now
      const targetDateStart = new Date(today);
      targetDateStart.setDate(today.getDate() + 7);
      targetDateStart.setHours(0, 0, 0, 0);

      const targetDateEnd = new Date(targetDateStart);
      targetDateEnd.setHours(23, 59, 59, 999);

      const expiringCertificates = await Certificate.find({
        expiresAt: {
          $gte: targetDateStart,
          $lte: targetDateEnd
        },
        status: 'VALID'
      }).populate('organizationId');

      if (expiringCertificates.length > 0) {
        console.log(`Found ${expiringCertificates.length} certificates expiring in 7 days.`);
        for (const cert of expiringCertificates) {
          if (cert.email) {
            await sendExpirationEmail(cert.email, cert.studentName, cert.internshipDomain, cert.organizationId);
          }
        }
      } else {
        console.log('No certificates expiring in 7 days.');
      }
    } catch (err) {
      console.error('Error running expiration cron job:', err);
    }
  });
  console.log('Expiration Cron Job scheduled.');
};

module.exports = startExpirationCron;
