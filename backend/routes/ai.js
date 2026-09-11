const express = require('express');
const router = express.Router();
const { analyzeUploadedImage, compareBeforeAndAfterAI } = require('../lib/aiEngine');

// POST /api/ai/analyze - Vision classification
router.post('/analyze', (req, res) => {
  const { imageHint, userDescription } = req.body;
  const analysis = analyzeUploadedImage(imageHint || '', userDescription);
  res.json({ success: true, analysis });
});

// POST /api/ai/verify - Before/After comparison
router.post('/verify', (req, res) => {
  const { category, citizenVerdict } = req.body;
  const comparison = compareBeforeAndAfterAI(category || 'pothole', citizenVerdict);
  res.json({ success: true, comparison });
});

module.exports = router;
