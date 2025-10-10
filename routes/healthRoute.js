// routes/health.js
const express = require('express');
const router = express.Router();

// GET /healthz
router.get('/', (req, res) => {
  res.status(200).send('OK');
});

// HEAD /healthz
router.head('/', (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
