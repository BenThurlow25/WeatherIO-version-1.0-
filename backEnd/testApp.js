console.log("Calling getWeatherData...");
const app = require('./app.js');
const dotenv = require('dotenv').config();

input = await app.getWeatherData("Providence, Rhode Island, USA")

(async () => {
  const result = await app.getForecastData(input);
  console.log("Weather result:", input); // ✅ This logs the API data
  console.log("Weather result:", result); 
  console.log("User-Agent:", process.env.USER_AGENT);

})();
