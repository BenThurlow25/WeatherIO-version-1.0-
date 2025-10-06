import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base:"https://github.com/BenThurlow25/WeatherIO-version-1.0-",
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // or whatever port your backend runs on
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

