import { useState } from 'react';
import Particles from './components/galaxy_background.jsx';
import AnimatedTextLoop from './components/AnimatedTextLoop.jsx';
import WeatherProfile from './WeatherProfile.jsx';
import WeatherDisplay from './components/WeatherDisplay.jsx'
import CardGrid from './components/cardgrid.jsx'
import WeeklyForecastCard from './components/WeatherCards/weekly_forecast_card';
import DailyForecastCard from './components/WeatherCards/daily_forecast_card';
import './App.css';
import UvIndexCard from './components/WeatherCards/uv_index_display.jsx';


function App() {
  const [location, setLocation] = useState('');
  const [currentScreen, setCurrentScreen] = useState('location');
  const [weeklyWeatherData, setWeeklyWeatherData] = useState(null); // NEW
  const [dailyWeatherData, setDailyWeatherData] = useState(null); // NEW
  const [uvIndex, setUvIndex] = useState(null);


 const handleSubmit = async () => {
  setCurrentScreen('loading'); // ✅ show loading message
  try {
    const response = await fetch(`https://weatherio-version-1-0.onrender.com/?q=${encodeURIComponent(location)}`);
    const result = await response.json();
    console.log('Weekly:', result.dailyForecast);
    console.log('Hourly:', result.hourlyForecast);

    setWeeklyWeatherData(result.dailyForecast);
    setDailyWeatherData(result.hourlyForecast.slice(0, 24));
    setUvIndex(result.uvIndex);
    setCurrentScreen('display');
  } catch (error) {
    console.error('Error fetching weather:', error);
    setCurrentScreen('location');
  }
};


    const phrases = [
    "Providence",
    "Boston",
    "New York",
    "Portland",
    "Seattle",
    "Chicago"
  ];



  return (
  <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
    <Particles
      particleColors={['#ffffff', '#a0cfff']}
      cameraDistance={1}
      particleCount={400}
      particleSpread={20}
      speed={0.2}
      particleBaseSize={1000}
      sizeRandomness={0.3}
      moveParticlesOnHover={true}
      alphaParticles={true}
      disableRotation={true}
    />

    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        padding: '2rem',
        color: 'white',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {currentScreen === 'location' && (
        <>
          <h1 style={{ position: 'relative', right: 20, fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', fontSize: '3rem', marginBottom: '1rem' }}>
            WeatherIO
          </h1>

          <div style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
            Get the forecast for{' '}
            <span
              style={{
                display: 'inline-block',
                minWidth: '93px',
                textAlign: 'left',
              }}
            >
              <AnimatedTextLoop
                texts={phrases}
                interval={3000}
                delay={150}
                animateBy="words"
                direction="top"
                className="text-2xl font-semibold text-white"
              />
            </span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault(); // ✅ prevents page reload
              handleSubmit();
            }}
            style={{ display: 'flex', gap: '1rem' }}
          >
            <input
              type="text"
              placeholder="e.g. Providence"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '1rem',
                borderRadius: '5px',
                border: 'none',
                outline: 'none',
                width: '250px',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '0.5rem 1.2rem',
                fontSize: '1rem',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: '#4a90e2',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Submit
            </button>
          </form>

          <h4
            style={{
              fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
              fontSize: '1rem',
              marginBottom: '1rem',
              position: 'absolute',
              bottom: '50px',
              color: 'gray',
            }}
          >
            created by Ben Thurlow using NOMINATIM and NWS
          </h4>
        </>
      )}

    {currentScreen === 'loading' && (
      <p style={{ color: 'white', fontSize: '1.5rem' }}>Fetching forecast data...</p>
    )}

{currentScreen === 'display' &&
 weeklyWeatherData &&
 dailyWeatherData && (
   <div className="forecast-layout">
     <div className="weekly-wrapper">
       <WeeklyForecastCard data={weeklyWeatherData} />
     </div>
     <div className="daily-wrapper">
       <DailyForecastCard data={dailyWeatherData} />
     </div>
     {typeof uvIndex === 'number' && !isNaN(uvIndex) && (
       <div className="UvIndex-wrapper">
         <UvIndexCard data={uvIndex} />
       </div>
     )}
   </div>
)}


    </div>
  </div>
);
}

export default App;