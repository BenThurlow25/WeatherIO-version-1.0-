
import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';
import { find } from 'geo-tz';

async function getUvData(lat, lon) {
  const [timezone] = find(lat, lon);
  const zipcode = await getZipcodeFromCoordinates(lat, lon);
 const localTimeStr = new Date().toLocaleString("en-US", { timeZone: timezone });
const localTime = new Date(localTimeStr);
const localHour = localTime.getHours(); // ✅ works


  if (!zipcode) {
    console.log("No ZIP code found for coordinates.");
    return "N/A";
  }

  const url = `https://data.epa.gov/efservice/getEnvirofactsUVHOURLY/ZIP/${zipcode}/JSON`;
  console.log("Called getUVData with link: " + url);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': process.env.USER_AGENT
      }
    });

    const data = await response.json();

    const uvReturn = parseFloat(data[localHour]?.UV_VALUE ?? "NaN");
    return uvReturn;
  } catch (error) {
    console.error("Error fetching UV data:", error);
    return "N/A";
  }
}

async function getWeatherData(location) {
  try {
    console.log("Step 1: Getting geo location...");
    const geo = await getGeoLocation(location);
    //console.log("Geo result:", geo);

    if (!geo) throw new Error('No coordinates found');

    const { lat, lon } = geo;
    console.log("Step 2: Getting weather process...");
    const weatherMeta = await getWeatherProcess(geo.lat, geo.lon);
   const uvApiReturn = await getUvData(geo.lat, geo.lon);
    //console.log("Weather meta:", weatherMeta);



    const forecastUrl = weatherMeta?.properties?.forecast;
    const dailyForecastUrl = weatherMeta?.properties?.forecastHourly;
    if (!forecastUrl || typeof forecastUrl !== 'string') {
      throw new Error('Invalid forecast URL');
    }

    console.log("Step 3: Getting forecast data...");
    const forecastPeriods = await getForecastData(weatherMeta?.properties?.forecast);
    //console.log("Forecast periods:", forecastPeriods?.length);
    console.log("Step 4: Getting hourly forecast...");
    const dailyForecast = await getDailyForecastData(dailyForecastUrl);
    //console.log("Hourly forecast periods:", dailyForecast?.length);
    const uvIndex = uvApiReturn
    console.log("Today’s UV Index:", uvIndex);

    return {
      dailyForecast: forecastPeriods,
      hourlyForecast: dailyForecast || [],
      UVIndexData: uvIndex
    };


  } catch (err) {
    throw err;
  }
}

function normalizeLocationInput(input) {
  return input
    .toLowerCase()
    .replace(/[^\w\s]/gi, '') // remove punctuation
    .replace(/\s+/g, ' ')     // collapse whitespace
    .trim();
}

function getGeoLocation(locName) {
 const normalized = normalizeLocationInput(locName);
const params = new URLSearchParams({
  q: normalized,
  format: "json",
  limit: 5
});


  return fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
    headers: {
      'User-Agent': process.env.USER_AGENT
    }
  })
    .then(response => response.json())
    .then(data => {
      const cityMatch = data.find(
        loc => loc.class === "place" && loc.type === "city"
      );
      const location = cityMatch || data[0];
      if (!location) return null;
      return {
        lat: parseFloat(location.lat),
        lon: parseFloat(location.lon)
      };
    })
    .catch(() => null);
}

function getWeatherProcess(lat, lon) {
  const url = `https://api.weather.gov/points/${lat},${lon}`;

  return fetch(url, {
    headers: {
      'User-Agent': process.env.USER_AGENT,
      'Accept': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => data)
    .catch(() => null);
}

async function getForecastData(URL) {
  console.log("getForecastData called with:", URL);
  try {
    const response = await fetch(URL, {
      headers: {
        'Accept': 'application/ld+json, application/json'
      }
    });

    const contentType = response.headers.get('content-type');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    if (!contentType ||
        (!contentType.includes('application/json') &&
         !contentType.includes('application/ld+json'))) {
      throw new Error(`Invalid content-type: ${contentType}`);
    }

    const data = await response.json(); 
    const periods = data.periods;
    console.log("Forecast periods count:", Array.isArray(periods) ? periods.length : 'Not an array');

    if (!Array.isArray(periods) || periods.length === 0) {
      throw new Error('No forecast data available');
    }

    return periods;
  } catch (error) {
    throw error;
  }
}

async function getDailyForecastData(URL) {
  console.log("getDailyForecastData called with:", URL);
  try {
    const response = await fetch(URL, {
      headers: {
        'Accept': 'application/ld+json, application/json'
      }
    });

    const contentType = response.headers.get('content-type');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    if (!contentType ||
        (!contentType.includes('application/json') &&
         !contentType.includes('application/ld+json'))) {
      throw new Error(`Invalid content-type: ${contentType}`);
    }

    const data = await response.json();
    const periods =
      Array.isArray(data?.properties?.periods)
        ? data.properties.periods
        : Array.isArray(data?.periods)
          ? data.periods
          : null;

    if (!Array.isArray(periods) || periods.length === 0) {
      throw new Error('No hourly forecast data available');
    }

    return periods;
  } catch (error) {
    throw error;
  }
}

async function getZipcodeFromCoordinates(latitude, longitude) {
  const url = `https://us1.locationiq.com/v1/reverse.php?key=${process.env.LOCATIONIQ_API_KEY}&lat=${latitude}&lon=${longitude}&format=json`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': process.env.USER_AGENT
      }
    });

    const data = await response.json();

    const zip = data?.address?.postcode;
    if (zip) {
      return zip;
    } else {
      console.log("ZIP Code not found for these coordinates.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching ZIP from LocationIQ:", error);
    return null;
  }
}








export {
  getGeoLocation,
  getWeatherProcess,
  getWeatherData,
  getForecastData,
  getDailyForecastData,
  getUvData
};


