import axios from "axios";

/**
 * Geocoding service using Open-Meteo's free geocoding API.
 *
 * @function geocode
 * @description
 * Converts a city/place name into geographical coordinates.
 * This service:
 *  - Fetches up to 5 matching locations for the given query
 *  - Selects the best match (exact match preferred; otherwise highest population)
 *  - Returns a structured geo object for consumption by the weather API
 *
 * The response includes:
 *  - name: city name
 *  - country: country name
 *  - latitude/longitude: coordinates
 *  - timezone: IANA timezone string
 *  - population: optional population number (helps ranking)
 *  - admin1: state/province/region if available
 *
 * To reduce API calls, results are cached in-memory for CACHE_TTL seconds.
 *
 * @param {string} query - City name or location query string
 * @returns {Promise<Object|null>} Geocoding result or null if not found
 */

const GEOCODE_BASE = "https://geocoding-api.open-meteo.com/v1/search";

/** In-memory cache map */
const cache = new Map();

/** Cache time-to-live in ms (default: 300s = 5 minutes) */
const CACHE_TTL = (Number(process.env.CACHE_TTL_SECONDS) || 300) * 1000;

/**
 * Store data in the geocode cache.
 * @param {string} key
 * @param {*} value
 */
function setCache(key, value) {
  cache.set(key, { value, created: Date.now() });
}

/**
 * Retrieve data from cache if still valid.
 * @param {string} key
 * @returns {*} cached value or null
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

export default async function geocode(query) {
  // Construct cache key for this query
  const key = `geo:${query.toLowerCase()}`;

  // Return cached entry if available
  const cached = getCache(key);
  if (cached) return cached;

  // Build request URL
  const url = `${GEOCODE_BASE}?name=${encodeURIComponent(
    query
  )}&count=5&language=en&format=json`;

  // Call the geocoding API
  const resp = await axios.get(url, { timeout: 8000 });
  const data = resp.data;

  // No results → return null
  if (!data || !data.results || data.results.length === 0) return null;

  /**
   * Choose the best candidate:
   * - Prefer exact name match (case-insensitive)
   * - Otherwise pick the location with highest population
   */
  let candidate = data.results[0];
  for (const c of data.results) {
    // Exact string match
    if (c.name.toLowerCase() === query.toLowerCase()) {
      candidate = c;
      break;
    }

    // Otherwise pick most populated entry
    if ((c.population || 0) > (candidate.population || 0)) {
      candidate = c;
    }
  }

  // Final structured result
  const out = {
    name: candidate.name,
    country: candidate.country,
    latitude: candidate.latitude,
    longitude: candidate.longitude,
    timezone: candidate.timezone || "UTC",
    population: candidate.population || null,
    admin1: candidate.admin1 || null,
  };

  // Cache result
  setCache(key, out);

  return out;
}
