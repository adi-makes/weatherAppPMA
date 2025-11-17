import axios from "axios";

/**
 * Fetch weather and forecast data from the Open-Meteo API.
 *
 * @param {Object} geo - Geolocation result containing latitude, longitude, timezone, etc.
 * @param {number} geo.latitude
 * @param {number} geo.longitude
 * @param {string} geo.timezone
 *
 * @description
 * This service performs two main tasks:
 * 1. Queries the Open-Meteo API for:
 *    - Current weather
 *    - Hourly weather metrics (humidity, precipitation, apparent temperature)
 *    - Daily forecast (max/min temperatures, precipitation, sunrise/sunset, weather code)
 *
 * 2. Formats the API data into a clean, frontend-friendly structure.
 *
 * To reduce load and avoid unnecessary API calls, the function implements
 * a simple in-memory caching layer. Cached results live for CACHE_TTL seconds.
 *
 * @returns {Promise<Object>} Formatted weather + forecast object.
 */

const BASE = "https://api.open-meteo.com/v1/forecast";

/** In-memory cache for storing API responses */
const cache = new Map();

/** TTL for cache entries (default: 300 seconds = 5 min) */
const CACHE_TTL = (Number(process.env.CACHE_TTL_SECONDS) || 300) * 1000;

/**
 * Store data in cache.
 * @param {string} key
 * @param {*} value
 */
function setCache(key, value) {
  cache.set(key, { value, created: Date.now() });
}

/**
 * Retrieve cached value if still valid.
 * Deletes entry if expired.
 *
 * @param {string} key
 * @returns {*} Cached value or null if expired/not found
 */
function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;

  const isExpired = Date.now() - entry.created > CACHE_TTL;
  if (isExpired) {
    cache.delete(key);
    return null;
  }

  return entry.value;
}

export default async function fetchWeather(geo) {
  // Construct unique cache key per geo-coordinates
  const key = `weather:${geo.latitude},${geo.longitude}`;

  // Use cached data if available
  const cached = getCache(key);
  if (cached) return cached;

  // Build API query parameters
  const params = new URLSearchParams({
    latitude: String(geo.latitude),
    longitude: String(geo.longitude),
    timezone: "auto",
    current_weather: "true",
    hourly:
      "apparent_temperature,relativehumidity_2m,precipitation,temperature_2m",
    daily:
      "temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode,sunrise,sunset",
    forecast_days: "5",
  });

  const url = `${BASE}?${params.toString()}`;

  // Fetch data from Open-Meteo API
  const resp = await axios.get(url, { timeout: 10000 });
  const d = resp.data;

  /** Current weather section from API */
  const current = d.current_weather || null;

  /**
   * Extract hourly values aligned with the current time index.
   * If current time index doesn't exist, fallback to first hour entry.
   */
  let humidity = null,
    apparent_temperature = null,
    precipitation = null;

  if (d.hourly && current) {
    const idx = d.hourly.time.indexOf(current.time);

    if (idx >= 0) {
      apparent_temperature = d.hourly.apparent_temperature?.[idx] ?? null;
      humidity = d.hourly.relativehumidity_2m?.[idx] ?? null;
      precipitation = d.hourly.precipitation?.[idx] ?? null;
    } else {
      // Fallback if matching timestamp isn't found
      apparent_temperature = d.hourly.apparent_temperature?.[0] ?? null;
      humidity = d.hourly.relativehumidity_2m?.[0] ?? null;
      precipitation = d.hourly.precipitation?.[0] ?? null;
    }
  }

  /** Format 5-day daily data */
  const daily = [];
  if (d.daily) {
    const days = d.daily.time || [];

    for (let i = 0; i < days.length; i++) {
      daily.push({
        date: days[i],
        temp_max: d.daily.temperature_2m_max?.[i] ?? null,
        temp_min: d.daily.temperature_2m_min?.[i] ?? null,
        precipitation_sum: d.daily.precipitation_sum?.[i] ?? null,
        weathercode: d.daily.weathercode?.[i] ?? null,
        sunrise: d.daily.sunrise?.[i] ?? null,
        sunset: d.daily.sunset?.[i] ?? null,
      });
    }
  }

  /**
   * Final normalized output structure
   */
  const out = {
    fetched_at: new Date().toISOString(),
    timezone: d.timezone || geo.timezone,
    current: {
      temperature: current?.temperature ?? null,
      windspeed: current?.windspeed ?? null,
      winddirection: current?.winddirection ?? null,
      weathercode: current?.weathercode ?? null,
      time: current?.time ?? null,
      apparent_temperature,
      humidity,
      precipitation,
    },
    daily,
  };

  // Save result to cache
  setCache(key, out);

  return out;
}
