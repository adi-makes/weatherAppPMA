// frontend/src/components/ForecastCard.jsx
import React from "react";
import { weatherCodeToIcon } from "../icons";

function dayLabel(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export default function ForecastCard({ day }) {
  if (!day) return null;
  const { Icon, label } = weatherCodeToIcon(day.weathercode, false);
  return (
    <div className="fcard card">
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
        <Icon className="mini-icon" size={36} />
      </div>
      <div className="fday">{dayLabel(day.date)}</div>
      <div className="small">{label}</div>
      <div className="ftemp">High {Math.round(day.temp_max)}° • Low {Math.round(day.temp_min)}°</div>
      <div className="small" style={{ marginTop: 6 }}>{day.precipitation_sum != null ? `${Math.round(day.precipitation_sum)} mm precip` : ""}</div>
    </div>
  );
}
