import React from 'react';

function WeatherProfile ({location}){
    return(
    <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        Weather for {location}
      </h2>
      <p>Fetching forecast data...</p>
    </div>
  );
}

export default WeatherProfile;
