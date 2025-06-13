const mongoose = require('mongoose');

const membershipSchemeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  validityMonths: { type: Number, required: true },
  benefits: [String],
});

module.exports = mongoose.model('MembershipScheme', membershipSchemeSchema);
