const crypto = require('crypto');

const cryptoUtils = {
  // Generate a unique SHA-256 hash for a certificate
  generateHash: (data) => {
    const stringified = JSON.stringify({
      id: data.certificateId,
      name: data.studentName,
      domain: data.internshipDomain,
      start: data.startDate,
      end: data.endDate
    });
    return crypto.createHash('sha256').update(stringified).digest('hex');
  },

  // Simple encryption for secure QR metadata
  encryptId: (id) => {
    return Buffer.from(id).toString('base64');
  }
};

module.exports = cryptoUtils;
