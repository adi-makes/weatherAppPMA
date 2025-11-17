// frontend/src/components/CurrentWeather.jsx
import React from "react";
import { weatherCodeToIcon } from "../icons";

function formatTime(s, tz) {
  if (!s) return "-";
  const d = new Date(s);
  // show only time (hours:minutes)
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export default function CurrentWeather({ location, weather }) {
  if (!location || !weather) return null;
  const c = weather.current;
  // determine if local time is night-ish using hour (fallback false)
  let isNight = false;
  try {
    const h = new Date(c.time).getHours();
    isNight = h < 6 || h >= 18;
  } catch (e) {
    isNight = false;
  }

  const { Icon, label } = weatherCodeToIcon(c.weathercode, isNight);

  return (
    <div className="current card">
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div className="icon-hero" aria-hidden>
          <Icon className="animated-icon" size={82} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0 }}>
            {location.name}{location.admin1 ? `, ${location.admin1}` : ""} — {location.country}
          </h3>
          <div style={{ marginTop: 6, color: "var(--muted)" }}>{label}</div>
          <div className="bigtemp" style={{ marginTop: 8 }}>
            {c.temperature != null ? `${Math.round(c.temperature)}°C` : "-"}
          </div>
          <div className="meta" style={{ marginTop: 8 }}>
            {c.apparent_temperature != null && <div>Feels like: {Math.round(c.apparent_temperature)}°C</div>}
            {c.humidity != null && <div>Humidity: {Math.round(c.humidity)}%</div>}
            {c.windspeed != null && <div>Wind: {c.windspeed} km/h</div>}
            {c.precipitation != null && <div>Precip: {c.precipitation} mm</div>}
            <div>Local time: {c.time ? new Date(c.time).toLocaleString() : "-"}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <div className="chip">
          Sunrise: {weather.daily?.[0]?.sunrise ? formatTime(weather.daily[0].sunrise) : "-"}
        </div>
        <div className="chip">
          Sunset: {weather.daily?.[0]?.sunset ? formatTime(weather.daily[0].sunset) : "-"}
        </div>
        <div className="chip">
          Timezone: {weather.timezone}
        </div>
      </div>
    </div>
  );
}
