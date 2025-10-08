
import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';
import { find } from 'geo-tz';
const apiKey = process.env.VITE_LOCATIONIQ_API_KEY;
const userAgent = process.env.VITE_USER_AGENT;

console.log('✅ This is the REAL app.js');


async function getUvData(lat, lon) {
  console.log('Entered getUvData');

  const [timezone] = find(lat, lon);
  const zipcode = await getZipcodeFromCoordinates(lat, lon);

  if (!zipcode) {
    console.log("No ZIP code found for coordinates.");
    return "N/A";
  }

  console.log('Resolved ZIP for UV lookup:', zipcode);

  const targetHour = new Date().toLocaleString("en-US", {
    timeZone: timezone,
    hour: 'numeric',
    hour12: true
  }); // e.g. "10 AM"

  const url = `https://enviro.epa.gov/enviro/efservice/getEnvirofactsUVHOURLY/ZIP/${zipcode}/JSON`;
  console.log("Called getUVData with link:", url);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': userAgent
      }
    });

    const data = await response.json();

    console.log("🕒 targetHour:", targetHour);
    console.log("📊 EPA data length:", data.length);
    console.log("📊 EPA data sample:", data.slice(0, 3));

    const matchedEntry = data.find(entry =>
      entry.DATE_TIME.includes(targetHour)
    );

    console.log(`✅ Matched UV entry for ${targetHour}:`, matchedEntry);

    const uvValue = matchedEntry?.UV_VALUE;
    const uvReturn = uvValue !== undefined ? parseFloat(uvValue) : "N/A";

    console.log("🌞 Final UV value returned:", uvReturn);
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
    console.log('About to call getUvData...');
     let uvIndex = "N/A";
      try {
        console.log("Step 2.5: About to call getUvData...");
        uvIndex = await getUvData(geo.lat, geo.lon);
        console.log("Step 2.6: UV data returned:", uvIndex);
      } catch (uvErr) {
        console.error("UV data fetch failed:", uvErr);
      }
    //console.log("Weather meta:", weatherMeta);

    const locationString = `${geo.lat},${geo.lon}`;


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
  


    return {
    dailyForecast: forecastPeriods,
    hourlyForecast: dailyForecast || [],
    uvIndex: uvIndex,
    locationString: locationString
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
      'User-Agent': userAgent,
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
  const url = `https://us1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${latitude}&lon=${longitude}&format=json`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': userAgent
      }
    });
    
    const data = await response.json();
    console.log('LocationIQ response:', data);

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
  getUvData,
};


