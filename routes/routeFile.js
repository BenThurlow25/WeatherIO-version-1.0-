const express = require('express');
const router = express.Router();
const { getWeatherData } = require('../backEnd/app');

router.get('/', async (req, res) => {
  console.log('Received request for:', req.query.q);
  const location = req.query.q || 'Providence';

  try {
    const { dailyForecast, hourlyForecast, uvIndex, locationString } = await getWeatherData(location);

  res.json({
    dailyForecast,
    hourlyForecast,
    uvIndex:uvIndex,
    locationString: locationString
  });


  } catch (err) {
    console.error("Backend error:", err.stack);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

module.exports = router;
