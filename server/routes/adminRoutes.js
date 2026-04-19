const express = require('express');
const router = express.Router();
const db = require('../db_handler');
const AdmZip = require('adm-zip');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/logos'),
  filename: (req, file, cb) => cb(null, 'org_logo' + path.extname(file.originalname))
});
const upload = multer({ storage });

// @route   GET /api/admin/analytics
// @desc    Get dashboard stats
router.get('/analytics', (req, res) => {
  try {
    const certs = db.getAll();
    const logs = db.getLogs();
    
    // Domain distribution
    const domainStats = certs.reduce((acc, c) => {
      acc[c.internshipDomain] = (acc[c.internshipDomain] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalIssued: certs.length,
      revokedCount: certs.filter(c => c.revoked).length,
      domainStats,
      recentLogs: logs.slice(0, 20),
      allCertificates: certs // For the history table
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/admin/revoke/:id
// @desc    Revoke/Restore a certificate
router.post('/revoke/:id', (req, res) => {
  const { revoked } = req.body;
  db.updateStatus(req.params.id, revoked);
  res.json({ message: `Certificate ${revoked ? 'revoked' : 'restored'}` });
});

// @route   GET /api/admin/export-zip
// @desc    Export all certificate metadata to a ZIP
router.get('/export-zip', (req, res) => {
  try {
    const certs = db.getAll();
    const zip = new AdmZip();
    
    const content = JSON.stringify(certs, null, 2);
    zip.addFile("all_certificates_export.json", Buffer.from(content, "utf8"));
    
    const data = zip.toBuffer();
    res.set('Content-Type','application/octet-stream');
    res.set('Content-Disposition', `attachment; filename=CertVerify_Export_${Date.now()}.zip`);
    res.set('Content-Length', data.length);
    res.send(data);
    
    db.addLog('EXPORT', 'Mass exported all credentials as ZIP');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/admin/branding
router.get('/branding', (req, res) => {
  res.json(db.getBranding());
});

// @route   POST /api/admin/branding
router.post('/branding', (req, res) => {
  db.updateBranding(req.body);
  db.addLog('SETTINGS', 'Updated organization branding profile');
  res.json({ message: 'Settings updated' });
});

// @route   POST /api/admin/upload-logo
router.post('/upload-logo', upload.single('logo'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No logo file' });
  
  const branding = db.getBranding();
  branding.logo = `http://127.0.0.1:5000/public/logos/${req.file.filename}`;
  db.updateBranding(branding);
  db.addLog('SETTINGS', 'Updated organization branding seal');
  
  res.json({ message: 'Logo uploaded successfully', logoUrl: branding.logo });
});

module.exports = router;
