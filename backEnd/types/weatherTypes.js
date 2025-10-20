/**
 * @typedef {Object} ForecastPeriod
 * @property {string} name
 * @property {number} temperature
 * @property {string} shortForecast
 * @property {string} startTime
 * @property {string} endTime
 */

/**
 * @typedef {Object} WeatherDataContract
 * @property {ForecastPeriod[]} dailyForecast
 * @property {ForecastPeriod[]} hourlyForecast
 * @property {string} uvIndex
 * @property {string} locationString
 */
