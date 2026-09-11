const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'CivicSeva Kolkata Core Engine',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/incidents', require('./routes/incidents'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/authorities', require('./routes/authorities'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found on CivicSeva Backend' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  CivicSeva Backend REST API running on port ${PORT}`);
  console.log(`  Health check: http://localhost:${PORT}/health`);
  console.log(`  Incidents API: http://localhost:${PORT}/api/incidents`);
  console.log(`  Authorities API: http://localhost:${PORT}/api/authorities`);
  console.log(`====================================================`);
});

module.exports = app;
