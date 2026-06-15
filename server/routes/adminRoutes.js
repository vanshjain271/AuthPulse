const express = require('express');
const router = express.Router();
const AdmZip = require('adm-zip');
const multer = require('multer');
const path = require('path');
const https = require('https');
const sharp = require('sharp');
const fs = require('fs');

const auth = require('../middleware/auth');
const Template = require('../models/Template');
const Certificate = require('../models/Certificate');
const Organization = require('../models/Organization');

const getApiUrl = (req) => process.env.API_URL || `${req.protocol}://${req.get('host')}`;

// Apply auth middleware to all admin routes
router.use(auth);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../public/logos', req.organizationId);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, 'org_logo' + path.extname(file.originalname))
});

const templateStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../public/templates', req.organizationId);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, 'bg_' + Date.now() + path.extname(file.originalname))
});
// Allow up to 25MB for high-res Canva exports
const uploadTemplate = multer({ storage: templateStorage, limits: { fileSize: 25 * 1024 * 1024 } });

const assetStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../public/assets', req.organizationId);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, 'asset_' + Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });
const uploadAsset = multer({ storage: assetStorage });

// @route   GET /api/admin/analytics
// @desc    Get dashboard stats
router.get('/analytics', async (req, res) => {
  try {
    const certs = await Certificate.find({ organizationId: req.organizationId });
    // Assuming you might want to add logs to MongoDB later, keeping it empty for now or using a generic log.
    const logs = []; 
    
    // Domain distribution
    const domainStats = certs.reduce((acc, c) => {
      acc[c.internshipDomain] = (acc[c.internshipDomain] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalIssued: certs.length,
      revokedCount: certs.filter(c => c.status === 'REVOKED').length,
      domainStats,
      recentLogs: logs,
      allCertificates: certs
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/admin/revoke/:id
// @desc    Revoke/Restore a certificate
router.post('/revoke/:id', async (req, res) => {
  try {
    const { revoked } = req.body;
    const cert = await Certificate.findOneAndUpdate(
      { certificateId: req.params.id, organizationId: req.organizationId },
      { status: revoked ? 'REVOKED' : 'VALID' }
    );
    if (!cert) return res.status(404).json({ message: 'Certificate not found' });
    res.json({ message: `Certificate ${revoked ? 'revoked' : 'restored'}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/admin/export-zip
// @desc    Export all certificate metadata to a ZIP
router.get('/export-zip', async (req, res) => {
  try {
    const certs = await Certificate.find({ organizationId: req.organizationId });
    const zip = new AdmZip();
    
    const content = JSON.stringify(certs, null, 2);
    zip.addFile("all_certificates_export.json", Buffer.from(content, "utf8"));
    
    const data = zip.toBuffer();
    res.set('Content-Type','application/octet-stream');
    res.set('Content-Disposition', `attachment; filename=CertVerify_Export_${Date.now()}.zip`);
    res.set('Content-Length', data.length);
    res.send(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/admin/branding
router.get('/branding', async (req, res) => {
  try {
    const org = await Organization.findById(req.organizationId);
    res.json({ colors: { primary: org.brandColor || '#b45309' }, logo: org.logo || '' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/admin/branding
router.post('/branding', async (req, res) => {
  try {
    const { brandColor, logo } = req.body;
    await Organization.findByIdAndUpdate(req.organizationId, { brandColor, logo });
    res.json({ message: 'Settings updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/admin/upload-logo
router.post('/upload-logo', upload.single('logo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No logo file' });
  
  const logoUrl = `${getApiUrl(req)}/public/logos/${req.organizationId}/${req.file.filename}`;
  await Organization.findByIdAndUpdate(req.organizationId, { logo: logoUrl });
  res.json({ message: 'Logo uploaded successfully', logoUrl });
});

// @route   GET /api/admin/templates
router.get('/templates', async (req, res) => {
  try {
    const templates = await Template.find({ organizationId: req.organizationId });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/admin/templates
router.post('/templates', async (req, res) => {
  try {
    const { name, background, elements } = req.body;
    const template = new Template({
      organizationId: req.organizationId,
      name,
      background,
      elements
    });
    await template.save();
    res.json({ message: 'Template saved successfully', template });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/admin/templates/upload-bg
// Accepts high-res PNG exports (up to 25MB), auto-detects aspect ratio
router.post('/templates/upload-bg', uploadTemplate.single('background'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No background file' });
  const bgUrl = `${getApiUrl(req)}/public/templates/${req.organizationId}/${req.file.filename}`;
  try {
    const metadata = await sharp(req.file.path).metadata();
    const aspectRatio = metadata.width / metadata.height;
    res.json({ bgUrl, aspectRatio });
  } catch (e) {
    // Fallback to standard A4 landscape if sharp fails
    res.json({ bgUrl, aspectRatio: 1.414 });
  }
});

// @route   DELETE /api/admin/templates/:id
router.delete('/templates/:id', async (req, res) => {
  try {
    const template = await Template.findOneAndDelete({ _id: req.params.id, organizationId: req.organizationId });
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json({ message: 'Template archived' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/admin/assets/upload
router.post('/assets/upload', uploadAsset.single('asset'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No asset file' });
  const assetUrl = `${getApiUrl(req)}/public/assets/${req.organizationId}/${req.file.filename}`;
  res.json({ assetUrl });
});

// @route   GET /api/admin/assets
router.get('/assets', (req, res) => {
  const assetsDir = path.join(__dirname, '../public/assets', req.organizationId);
  if (!fs.existsSync(assetsDir)) return res.json([]);
  
  const files = fs.readdirSync(assetsDir);
  const assets = files.map(f => `${getApiUrl(req)}/public/assets/${req.organizationId}/${f}`);
  res.json(assets);
});

// @route   POST /api/admin/trigger-expiration-email
router.post('/trigger-expiration-email', async (req, res) => {
  try {
    const { emailService } = require('../utils/emailService');
    const { sendExpirationEmail } = require('../utils/emailService');
    const certs = await Certificate.find({ organizationId: req.organizationId, status: 'VALID' }).populate('organizationId').limit(1);
    
    if (certs.length === 0) {
      return res.status(404).json({ message: 'No valid certificates found to test with.' });
    }
    
    const testCert = certs[0];
    if (!testCert.email) {
      return res.status(400).json({ message: 'The latest certificate has no email to test with.' });
    }
    
    await sendExpirationEmail(testCert.email, testCert.studentName, testCert.internshipDomain, testCert.organizationId);
    
    res.json({ message: `Test expiration email sent successfully to ${testCert.email}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
