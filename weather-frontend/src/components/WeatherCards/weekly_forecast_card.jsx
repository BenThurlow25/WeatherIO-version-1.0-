import React from 'react';
import './weekly_forecast_card.css';

const WeeklyForecastCard = ({ data }) => {
  return (
    <div className="weather-card weekly-grid">
      {data.map((period, index) => (
        <div key={index} className="forecast-item">
          <h4>{period.name}</h4>
          <img src={period.icon} alt={period.shortForecast} />
          <p>{period.temperature}°{period.temperatureUnit}</p>
          <p>{period.shortForecast}</p>
        </div>
      ))}
    </div>
  );
};

export default WeeklyForecastCard;

