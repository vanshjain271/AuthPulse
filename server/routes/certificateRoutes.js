const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const Certificate = require('../models/Certificate');
const Organization = require('../models/Organization');
const { sendCertificateEmail } = require('../utils/emailService');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// @route   GET /api/certificates/:id
// @desc    Get certificate by ID (Public verification)
router.get('/:id', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.id }).populate('organizationId', 'name logo brandColor');
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    res.json(certificate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/certificates/upload
// @desc    Upload Excel sheet and save data
// @access  Private (Organization only)
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const org = await Organization.findById(req.organizationId);
    if (!org) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    const templateId = req.body.templateId;
    let savedCount = 0;

    for (let item of data) {
      const studentName = item['Student Name'] || item.studentName;
      const certificateId = (item['Certificate ID'] || item.certificateId || '').toString().trim();
      const internshipDomain = item['Internship Domain'] || item.internshipDomain || 'General';
      const email = item['Email'] || item.email;
      const startDate = new Date(item['Start Date'] || item.startDate || Date.now());
      const endDate = new Date(item['End Date'] || item.endDate || Date.now());

      if (!studentName || !certificateId) continue;

      // Generate SHA-256 Hash
      const hashPayload = `${certificateId}-${studentName}-${internshipDomain}-${startDate.getTime()}`;
      const hash = crypto.createHash('sha256').update(hashPayload).digest('hex');

      const cert = new Certificate({
        organizationId: req.organizationId,
        templateId: templateId || null,
        certificateId,
        studentName,
        email,
        internshipDomain,
        startDate,
        endDate,
        hash
      });

      await cert.save();
      savedCount++;

      // Trigger Email
      if (email) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const certUrl = `${frontendUrl}/verify/${certificateId}`;
        // Note: sendCertificateEmail now takes the full org object for branding
        await sendCertificateEmail(email, studentName, certUrl, org);
      }
    }

    res.status(201).json({ 
      message: 'Bulk upload successful', 
      count: savedCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing file: ' + err.message });
  }
});

module.exports = router;
