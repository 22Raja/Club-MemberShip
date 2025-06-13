const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  membershipId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  membershipScheme: { type: mongoose.Schema.Types.ObjectId, ref: 'MembershipScheme', required: true },
  startDate: { type: Date, default: Date.now },
  expiryDate: { type: Date, required: true },
});

module.exports = mongoose.model('Member', memberSchema);
