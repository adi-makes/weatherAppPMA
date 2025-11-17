// -----------------------------------------------------------------------------
// Weather Icons Mapping
// -----------------------------------------------------------------------------
//
// This file maps Open-Meteo weather codes (WMO standard) to animated react-icons.
//
// The returned structure for each code is:
//    {
//      Icon: ReactComponent,
//      label: string   // Human-readable description for UI
//    }
//
// This improves UI readability and consistency across the application.
// -----------------------------------------------------------------------------

import {
  WiDaySunny,
  WiNightClear,
  WiDayCloudy,
  WiNightAltCloudy,
  WiCloud,
  WiFog,
  WiSprinkle,
  WiRain,
  WiShowers,
  WiSnow,
  WiSleet,
  WiThunderstorm,
  WiLightning
} from "react-icons/wi";

/**
 * ---------------------------------------------------------------------------
 * weatherCodeToIcon(code, isNight)
 * ---------------------------------------------------------------------------
 * Maps Open-Meteo weather codes → UI icon + human-readable label.
 *
 * @param {number|string} code     - WMO weather code returned by API
 * @param {boolean} [isNight=false] - Whether to use night variant of icons
 *
 * WMO Code Reference (simplified):
 *   0          → Clear sky
 *   1,2,3      → Mostly clear / partly cloudy / overcast
 *   45,48      → Fog / depositing rime fog
 *   51–57      → Drizzle
 *   61–67      → Rain
 *   71–77      → Snow or sleet
 *   80–82      → Rain showers
 *   95–99      → Thunderstorm (96,99 may include hail)
 *
 * @returns {{ Icon: React.Component, label: string }}
 */
export function weatherCodeToIcon(code, isNight = false) {
  // Normalize the code to a number
  const c = Number(code);

  // -----------------------------------------
  // Clear Sky
  // -----------------------------------------
  if (c === 0) {
    return {
      Icon: isNight ? WiNightClear : WiDaySunny,
      label: "Clear"
    };
  }

  // -----------------------------------------
  // Partly cloudy / overcast
  // -----------------------------------------
  if (c >= 1 && c <= 3) {
    return {
      Icon: isNight ? WiNightAltCloudy : WiDayCloudy,
      label: "Partly cloudy"
    };
  }

  // -----------------------------------------
  // Fog
  // -----------------------------------------
  if (c === 45 || c === 48) {
    return {
      Icon: WiFog,
      label: "Fog"
    };
  }

  // -----------------------------------------
  // Drizzle
  // -----------------------------------------
  if (c >= 51 && c <= 57) {
    return {
      Icon: WiSprinkle,
      label: "Drizzle"
    };
  }

  // -----------------------------------------
  // Rain
  // -----------------------------------------
  if (c >= 61 && c <= 67) {
    return {
      Icon: WiRain,
      label: "Rain"
    };
  }

  // -----------------------------------------
  // Snow / sleet
  // -----------------------------------------
  if (c >= 71 && c <= 77) {
    return {
      Icon: WiSnow,
      label: "Snow"
    };
  }

  // -----------------------------------------
  // Rain showers
  // -----------------------------------------
  if (c >= 80 && c <= 82) {
    return {
      Icon: WiShowers,
      label: "Showers"
    };
  }

  // -----------------------------------------
  // Thunderstorm
  // -----------------------------------------
  if (c === 95 || c === 96 || c === 99) {
    return {
      Icon: WiThunderstorm,
      label: "Thunderstorm"
    };
  }

  // -----------------------------------------
  // Fallback
  // -----------------------------------------
  return {
    Icon: WiCloud,
    label: "Cloudy"
  };
}
