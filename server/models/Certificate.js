const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: false // Optional for MVP if they just use default for now
  },
  certificateId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  internshipDomain: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  expiresAt: {
    type: Date,
    required: false
  },
  hash: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['VALID', 'REVOKED'],
    default: 'VALID'
  },
  issuedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
