const fs = require('fs');
const path = require('path');
const cryptoUtils = require('./utils/crypto_utils');

const DB_PATH = path.join(__dirname, 'certificates.json');
const HISTORY_PATH = path.join(__dirname, 'history.json');
const BRANDING_PATH = path.join(__dirname, 'branding.json');

// Initialize files and Migrate existing records
[DB_PATH, HISTORY_PATH, BRANDING_PATH].forEach(p => {
  if (!fs.existsSync(p)) {
    fs.writeFileSync(p, JSON.stringify(p === BRANDING_PATH ? { 
      logo: null, 
      colors: { primary: '#1e293b', secondary: '#c2410c' },
      signatures: [] 
    } : [], null, 2));
  }
});

// Auto-migration for missing hashes
const migrate = () => {
  let changed = false;
  const certs = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  certs.forEach(c => {
    if (!c.hash) {
      c.hash = cryptoUtils.generateHash(c);
      c.revoked = c.revoked || false;
      changed = true;
    }
  });
  if (changed) fs.writeFileSync(DB_PATH, JSON.stringify(certs, null, 2));
};
migrate();

const db = {
  getAll: () => JSON.parse(fs.readFileSync(DB_PATH, 'utf8')),
  
  saveMany: (newCerts) => {
    const existing = db.getAll();
    const existingMap = new Map(existing.map(c => [c.certificateId, c]));
    
    newCerts.forEach(cert => {
      cert.hash = cryptoUtils.generateHash(cert);
      cert.revoked = false;
      existingMap.set(cert.certificateId, cert);
      db.addLog('UPLOAD', `Issued credential ${cert.certificateId} to ${cert.studentName}`);
    });

    const updated = Array.from(existingMap.values());
    fs.writeFileSync(DB_PATH, JSON.stringify(updated, null, 2));
    return updated.length;
  },

  findOne: (id) => db.getAll().find(c => c.certificateId === id),

  updateStatus: (id, revoked) => {
    const certs = db.getAll();
    const index = certs.findIndex(c => c.certificateId === id);
    if (index !== -1) {
      certs[index].revoked = revoked;
      fs.writeFileSync(DB_PATH, JSON.stringify(certs, null, 2));
      db.addLog(revoked ? 'REVOKE' : 'RESTORE', `Status changed for ID: ${id}`);
    }
  },

  getBranding: () => JSON.parse(fs.readFileSync(BRANDING_PATH, 'utf8')),
  updateBranding: (data) => fs.writeFileSync(BRANDING_PATH, JSON.stringify(data, null, 2)),

  getLogs: () => JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf8')),
  addLog: (action, description) => {
    try {
      const logs = db.getLogs();
      logs.unshift({ action, description, timestamp: new Date() });
      fs.writeFileSync(HISTORY_PATH, JSON.stringify(logs.slice(0, 100), null, 2));
    } catch (e) {
      console.error('Logging failed:', e);
    }
  }
};

module.exports = db;
