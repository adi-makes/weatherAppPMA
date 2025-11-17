import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Internal service modules
import geocode from "./services/geocode.js";
import fetchWeather from "./services/fetchWeather.js";

/**
 * Load environment variables from `.env`
 * Example:
 *   PORT=4000
 *   CACHE_TTL_SECONDS=300
 */
dotenv.config();

/**
 * ------------------------------------------------------------
 * Initialize Express App
 * ------------------------------------------------------------
 */
const app = express();

/**
 * Enable Cross-Origin Resource Sharing (CORS)
 * This allows the frontend (React/Vite) to call this backend API.
 */
app.use(cors());

/**
 * Parse incoming JSON request bodies
 * Makes req.body available for POST/PUT routes (even though we don't use it here).
 */
app.use(express.json());

/** Server port pulled from environment or defaulting to 4000 */
const PORT = process.env.PORT || 4000;

/**
 * ------------------------------------------------------------
 * Health Check Route
 * ------------------------------------------------------------
 * Used to verify whether the server is running.
 * Example: GET http://localhost:4000/api/health
 */
app.get("/api/health", (_, res) => res.json({ ok: true }));

/**
 * ------------------------------------------------------------
 * Main Weather Route
 * ------------------------------------------------------------
 * Endpoint: GET /api/weather?city=CityName
 *
 * Flow:
 *  1. Validate & sanitize user input
 *  2. Convert city → latitude/longitude (geocoding)
 *  3. Fetch weather & 5-day forecast data from Open-Meteo
 *  4. Return combined response to frontend
 */
app.get("/api/weather", async (req, res) => {
  try {
    /** Extract and sanitize `city` query parameter */
    const city = (req.query.city || "").trim();

    if (!city) {
      return res.status(400).json({
        error: "Query parameter 'city' is required."
      });
    }

    // Reject extremely long/invalid city names
    if (city.length > 80) {
      return res.status(400).json({
        error: "City query too long."
      });
    }

    /**
     * ------------------------------------------------------------
     * Step 1: Geocode the city name → coordinates
     * ------------------------------------------------------------
     */
    const geo = await geocode(city);
    if (!geo) {
      return res.status(404).json({
        error: "Location not found."
      });
    }

    /**
     * ------------------------------------------------------------
     * Step 2: Fetch weather + forecast data
     * ------------------------------------------------------------
     */
    const weather = await fetchWeather(geo);

    /**
     * Success Response Structure:
     * {
     *   location: { name, country, latitude, longitude, ... },
     *   weather: { current, daily, ... }
     * }
     */
    res.json({
      location: geo,
      weather
    });
  } catch (err) {
    console.error("Server error:", err?.message || err);

    /**
     * Generic fallback error.
     * Do NOT expose internal server messages to clients.
     */
    res.status(500).json({
      error: "Server error. Try again later."
    });
  }
});

/**
 * ------------------------------------------------------------
 * Start the Server
 * ------------------------------------------------------------
 */
app.listen(PORT, () => {
  console.log(`Weather backend listening on port ${PORT}`);
});
