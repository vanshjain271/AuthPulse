const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Organization = require('../models/Organization');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_mvp';

// Helper to hash password for MVP (Usually use bcrypt, but crypto is built-in)
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// @route   POST api/auth/register
// @desc    Register a new organization
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let org = await Organization.findOne({ email });
    if (org) {
      return res.status(400).json({ message: 'Organization already exists' });
    }

    org = new Organization({
      name,
      email,
      password: hashPassword(password)
    });

    await org.save();

    const payload = { organizationId: org.id };
    jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, organizationId: org.id });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate organization & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    let org = await Organization.findOne({ email });
    if (!org) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    if (org.password !== hashPassword(password)) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const payload = { organizationId: org.id };
    jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, organizationId: org.id });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
