import React from 'react';
import './weather-map-card.css';

const WeatherMapCard = ({ data }) => {
  if (!data || !data.includes(',')) return null;

  const [lat, lon] = data.split(',').map(Number);

  const windyUrl = `https://embed.windy.com/embed.html?type=map&location=${lat},${lon}&metricRain=default&metricTemp=default&metricWind=default&zoom=5&overlay=radar&product=radar&level=surface&lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&marker=true&message=true`;
  
  if (!data || typeof data !== 'string' || !data.includes(',')) {
  return <p>Radar map unavailable for this location.</p>;
}


  return (
    <div className="weather-map-card">
      <iframe
        width="650"
        height="450"
        src={windyUrl}
        frameBorder="0"
        allow="geolocation"
        title="Live Weather Radar"
      ></iframe>
    </div>
  );
};

export default WeatherMapCard;
