import CardGrid from '../components/cardgrid';
import WeeklyForecastCard from '../components/WeatherCards/weekly_forecast_card';
import DailyForecastCard from './WeatherCards/daily_forecast_card';
import UvIndexCard from "./WeatherCards/uv_index_display";


function WeatherDisplay({ weeklyData, dailyData, UVData }) {
   if (!weeklyData || !Array.isArray(weeklyData)) {
  return <p style={{ color: 'white' }}>No weekly forecast data available.</p>;
}

if (!dailyData || !Array.isArray(dailyData)) {
  return <p style={{ color: 'white' }}>No hourly forecast data available.</p>;
}


return (
  <div style={{ width: '100%', height: '100vh', overflowY: 'auto' }}>
  <CardGrid>
    <WeeklyForecastCard data={weeklyData} />
    <DailyForecastCard data={dailyData} />
    <UvIndexCard data = {uvIndex}/>
  </CardGrid>
  </div>
);
}

export default WeatherDisplay