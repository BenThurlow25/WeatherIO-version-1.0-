const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const { getWeatherData } = require('./backEnd/app.js');

const app = express();
app.use(cors());

// Load environment variables
const PORT = process.env.PORT || 3000;

// Mount weather route
app.use('/forecast', require('./routes/routeFile'));

// Root route for health check
app.get('/', (req, res) => {
  res.send('Weather backend is up and running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



