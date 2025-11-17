import axios from "axios";

/**
 * --------------------------------------------------------------------
 * API Base URL
 * --------------------------------------------------------------------
 * `VITE_API_BASE` is provided via Vite environment variables.
 * Example in .env:
 *   VITE_API_BASE="http://localhost:4000"
 *
 * If not supplied, the app defaults to the local backend server.
 */
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

/**
 * --------------------------------------------------------------------
 * getWeatherByCity(city)
 * --------------------------------------------------------------------
 * Calls the backend weather route:
 *    GET /api/weather?city=CityName
 *
 * @param {string} city - Name of the city entered by the user
 * @returns {Promise<Object>} Weather + location data returned by backend
 *
 * @description
 * This function is used by the React frontend to fetch:
 *  - current weather
 *  - 5-day daily forecast
 *  - formatted geolocation data
 *
 * Axios is configured with a 10-second timeout for safety.
 */
export async function getWeatherByCity(city) {
  const url = `${API_BASE}/api/weather?city=${encodeURIComponent(city)}`;

  // Send GET request to backend
  const resp = await axios.get(url, { timeout: 10000 });

  // Return parsed JSON data
  return resp.data;
}
