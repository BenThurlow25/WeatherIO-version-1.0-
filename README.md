# WeatherIO-version-1.0-
My first time developing a full-stack application, created using JSX with a node.js back end and REACT for the front end.  I will be working to continually improve as I learn new things, this was very much a learning project for me so any tips or critique is appreciated! 

APIS and Attributions:
Geolocation data: Nominatim API (https://nominatim.org/release-docs/latest/api/Overview)
UVIndex Data: EPA API (https://www.epa.gov/enviro/envirofacts-web-services)
Weather Data: NWS API (https://www.weather.gov/documentation/services-web-api)
For timezoning and zipcodes: LocationIQ (https://locationiq.com)
Background of the UI is from 'reactbits.dev' (https://reactbits.dev)
Uses Wind for the waether map widget(www.windy.com)

Features include: 
Timezone Aware UV index metric
Daily Forecast
Weekly Forecast
geo-tz for dynamic timezone resolution
Modular ES imports/exports for clean backend architecture
Reusable utilities like getLocalHour to match EPA hourly UV data to local time
Responsive React components with global styles for polished UI
Interactive Weather Map allowing realtime storm viewing.


Upcoming Features:
Fuzzytext recognition for cities (Very spelling sensitive right now)
Storm Mapping
Air Quality Display
Alerts and possible account system to save locations locally
