const express = require('express');
const router = express.Router();
const { KOLKATA_AUTHORITIES, KOLKATA_WARDS } = require('../data/seedData');

// GET /api/authorities - All Kolkata authorities
router.get('/', (req, res) => {
  res.json({ success: true, count: KOLKATA_AUTHORITIES.length, authorities: KOLKATA_AUTHORITIES });
});

// GET /api/authorities/wards - All Kolkata wards
router.get('/wards', (req, res) => {
  res.json({ success: true, count: KOLKATA_WARDS.length, wards: KOLKATA_WARDS });
});

module.exports = router;
