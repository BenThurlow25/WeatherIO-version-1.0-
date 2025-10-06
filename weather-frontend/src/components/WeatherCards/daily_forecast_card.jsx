import React from 'react';
import './daily_forecast_card.css';

const DailyForecastCard = ({ data }) => {
  return (
    <div className="daily-weather-card daily-grid">
      {data.map((period, index) => {
        const formattedTime = new Date(period.startTime).toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });

        return (
          <div key={index} className="forecast-item">
            <h4>{formattedTime}</h4>
            <img src={period.icon} alt={period.shortForecast} />
            <p>{period.temperature}°{period.temperatureUnit}</p>
            <p>{period.shortForecast}</p>
          </div>
        );
      })}
    </div>
  );
};

export default DailyForecastCard;
