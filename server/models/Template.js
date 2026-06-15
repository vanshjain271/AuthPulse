const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  name: { type: String, required: true },
  background: { type: String, required: true },
  elements: [{ type: mongoose.Schema.Types.Mixed }], // Flexible array to store all custom element objects
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Template', TemplateSchema);
