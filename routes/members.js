const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const MembershipScheme = require('../models/MembershipScheme');
const { v4: uuidv4 } = require('uuid');

// Helper to generate membership ID
function generateMembershipId() {
  return 'MID-' + uuidv4().split('-')[0].toUpperCase();
}

// Register new member
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, membershipSchemeId } = req.body;

    const scheme = await MembershipScheme.findById(membershipSchemeId);
    if (!scheme) return res.status(400).json({ error: 'Invalid membership scheme' });

    const membershipId = generateMembershipId();
    const startDate = new Date();
    const expiryDate = new Date(startDate);
    expiryDate.setMonth(expiryDate.getMonth() + scheme.validityMonths);

    const member = new Member({
      membershipId,
      name,
      email,
      phone,
      membershipScheme: scheme._id,
      startDate,
      expiryDate,
    });

    await member.save();
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get member by membershipId
router.get('/:membershipId', async (req, res) => {
  try {
    const member = await Member.findOne({ membershipId: req.params.membershipId }).populate('membershipScheme');
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update member details by membershipId
router.put('/:membershipId', async (req, res) => {
  try {
    const updateData = req.body;
    if (updateData.membershipScheme) {
      // Validate scheme if changing
      const scheme = await MembershipScheme.findById(updateData.membershipScheme);
      if (!scheme) return res.status(400).json({ error: 'Invalid membership scheme' });
      // Update expiryDate based on new scheme validity
      updateData.expiryDate = new Date();
      updateData.expiryDate.setMonth(updateData.expiryDate.getMonth() + scheme.validityMonths);
    }

    const member = await Member.findOneAndUpdate(
      { membershipId: req.params.membershipId },
      updateData,
      { new: true }
    ).populate('membershipScheme');

    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete member by membershipId
router.delete('/:membershipId', async (req, res) => {
  try {
    const member = await Member.findOneAndDelete({ membershipId: req.params.membershipId });
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json({ message: 'Member deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get membership expiry and days/months left
router.get('/:membershipId/expiry', async (req, res) => {
  try {
    const member = await Member.findOne({ membershipId: req.params.membershipId });
    if (!member) return res.status(404).json({ error: 'Member not found' });

    const now = new Date();
    const expiry = member.expiryDate;
    if (expiry < now) {
      return res.json({ message: 'Membership expired', expiryDate: expiry });
    }

    // Calculate difference
    const diffTime = Math.abs(expiry - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);

    res.json({
      expiryDate: expiry,
      daysLeft: diffDays,
      monthsLeft: diffMonths,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
