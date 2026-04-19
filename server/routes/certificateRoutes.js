const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const db = require('../db_handler');

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// @route   GET /api/certificates/:id
// @desc    Get certificate by ID
router.get('/:id', async (req, res) => {
  try {
    const certificate = db.findOne(req.params.id);
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
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    console.log('--- Upload Started ---');
    if (!req.file) {
      console.log('Error: No file in request');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('File size:', req.file.size);
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    console.log('Parsed data length:', data.length);
    if (data.length > 0) console.log('First record headers:', Object.keys(data[0]));

    // Map and validate data
    const certificates = data.map(item => {
      return {
        certificateId: (item['Certificate ID'] || item.certificateId || '').toString().trim(),
        studentName: item['Student Name'] || item.studentName || 'Unknown Student',
        internshipDomain: item['Internship Domain'] || item.internshipDomain || 'General',
        startDate: new Date(item['Start Date'] || item.startDate || Date.now()),
        endDate: new Date(item['End Date'] || item.endDate || Date.now()),
        issuedAt: new Date()
      };
    });

    console.log('Mapping complete. First cert ID:', certificates[0]?.certificateId);

    // Save to Local JSON DB
    const totalCount = db.saveMany(certificates);
    console.log('Database save successful. Total records:', totalCount);

    res.status(201).json({ 
      message: 'Bulk upload successful', 
      count: certificates.length,
      totalInDatabase: totalCount
    });
  } catch (err) {
    console.error('--- Upload Failed ---');
    console.error(err);
    res.status(500).json({ message: 'Error processing file: ' + err.message });
  }
});

module.exports = router;
