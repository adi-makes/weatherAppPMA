import React, { useState } from "react";

export default function WeatherForm({ onSearch, loading }) {
  const [city, setCity] = useState("");

  function submit(e) {
    e.preventDefault();
    const v = city.trim();
    if (!v) return onSearch(null, { error: "Please enter a city or place." });
    if (v.length > 80) return onSearch(null, { error: "City name too long." });
    onSearch(v);
  }

  return (
    <form onSubmit={submit} className="card">
      <div className="form-row">
        <input
          className="input"
          placeholder="Enter city, e.g. Pune or New York"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          aria-label="city"
        />
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Searching..." : "Get Weather"}
        </button>
      </div>
      <div className="small">Tip: Try city names (you can also include region/country for clarity).</div>
    </form>
  );
}
