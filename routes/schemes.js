const express = require('express');
const router = express.Router();
const MembershipScheme = require('../models/MembershipScheme');

// Create new scheme
router.post('/', async (req, res) => {
  try {
    const { name, validityMonths, benefits } = req.body;
    const scheme = new MembershipScheme({ name, validityMonths, benefits });
    await scheme.save();
    res.status(201).json(scheme);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all schemes
router.get('/', async (req, res) => {
  const schemes = await MembershipScheme.find();
  res.json(schemes);
});

// Update scheme by ID
router.put('/:id', async (req, res) => {
  try {
    const scheme = await MembershipScheme.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!scheme) return res.status(404).json({ error: 'Scheme not found' });
    res.json(scheme);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete scheme by ID
router.delete('/:id', async (req, res) => {
  try {
    const scheme = await MembershipScheme.findByIdAndDelete(req.params.id);
    if (!scheme) return res.status(404).json({ error: 'Scheme not found' });
    res.json({ message: 'Scheme deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
