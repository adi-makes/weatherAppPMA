import React, { useState } from "react";
import WeatherForm from "./components/WeatherForm";
import CurrentWeather from "./components/CurrentWeather";
import ForecastCard from "./components/ForecastCard";
import { getWeatherByCity } from "./api";

/**
 * --------------------------------------------------------------------
 * App Component (Main Frontend Controller)
 * --------------------------------------------------------------------
 *
 * Responsible for:
 *  - Handling user input from WeatherForm
 *  - Managing API calls to backend
 *  - Displaying loading, error, and weather states
 *  - Rendering current weather + 5-day forecast
 *
 * State variables:
 *  loading : boolean → Indicates API fetch in progress
 *  error   : string | null → Error message (if any)
 *  data    : object | null → Combined { location, weather } response
 */
export default function App() {
  const [loading, setLoading] = useState(false); // API loading state
  const [error, setError] = useState(null); // Error messages
  const [data, setData] = useState(null); // Weather data response

  /**
   * ------------------------------------------------------------
   * handleSearch(city, opt)
   * ------------------------------------------------------------
   * Triggered by WeatherForm when the user submits a city name.
   *
   * @param {string} city - User-input city to fetch weather for
   * @param {Object} opt  - Optional object (used for validation errors)
   *
   * Flow:
   *  1. Validate form (WeatherForm may provide opt.error)
   *  2. Reset UI state
   *  3. Fetch weather from backend
   *  4. Update UI on success/failure
   */
  async function handleSearch(city, opt) {
    // Handle form-level validation errors
    if (opt?.error) {
      setError(opt.error);
      return;
    }

    // Reset UI before new request
    setError(null);
    setData(null);
    setLoading(true);

    try {
      // Example backend response format:
      // { location: { ... }, weather: { current, daily } }
      const res = await getWeatherByCity(city);
      setData(res);
    } catch (err) {
      // Graceful error message:
      const msg =
        err?.response?.data?.error ??
        err.message ??
        "Failed to fetch weather data.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  /**
   * ------------------------------------------------------------
   * Render
   * ------------------------------------------------------------
   * Layout includes:
   *  - Header (logo + app title)
   *  - Weather search form
   *  - Error card
   *  - Loading card
   *  - Current weather + forecast cards
   */
  return (
    <div className="app">
      {/* Header Section */}
      <div className="header">
        <div className="logo">W</div>
        <div>
          <div className="title">Weather App</div>
          <div className="subtitle">
            Full-stack demo · Current weather + 5-day forecast
          </div>
        </div>
      </div>

      {/* Search Form */}
      <WeatherForm onSearch={handleSearch} loading={loading} />

      {/* Spacer */}
      <div style={{ height: 14 }} />

      {/* Error State */}
      {error && <div className="card error">{error}</div>}

      {/* Loading State */}
      {loading && <div className="card loading">Fetching weather…</div>}

      {/* Weather Result */}
      {data && (
        <div className="result">
          {/* Current Weather Card */}
          <CurrentWeather location={data.location} weather={data.weather} />

          {/* 5-Day Forecast Card Group */}
          <div style={{ flex: 1 }}>
            <div className="card">
              <div style={{ fontWeight: 700, marginBottom: 8 }}>
                5-Day Forecast
              </div>
              <div className="forecast">
                {data.weather.daily.map((day) => (
                  <ForecastCard key={day.date} day={day} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="footer small">
        Built with Open-Meteo (free). Timezone shown follows the location's
        local time.
      </div>
    </div>
  );
}
