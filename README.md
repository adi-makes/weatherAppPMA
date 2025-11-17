# 🌦️ WeatherAppPMA

[![License](https://img.shields.io/github/license/adi-makes/weatherAppPMA?style=for-the-badge)](LICENSE)
[![Issues](https://img.shields.io/github/issues/adi-makes/weatherAppPMA?style=for-the-badge)](https://github.com/adi-makes/weatherAppPMA/issues)
[![Forks](https://img.shields.io/github/forks/adi-makes/weatherAppPMA?style=for-the-badge)](https://github.com/adi-makes/weatherAppPMA/network/members)
[![Stars](https://img.shields.io/github/stars/adi-makes/weatherAppPMA?style=for-the-badge)](https://github.com/adi-makes/weatherAppPMA/stargazers)

### **A full-stack weather application | React + Vite + Express.js + Open-Meteo API**

WeatherAppPMA is a fully functional, beginner-friendly yet professional **full-stack weather application** built as part of the PMAccelerator learning track.  
It allows users to:
- ✔ Search weather by city  
- ✔ Validate and sanitize user input  
- ✔ Fetch **real-time weather** + **5-day forecast**  
- ✔ Display animated weather icons  
- ✔ Show sunrise/sunset, humidity, feels-like temperature  
- ✔ Provide a clean, aesthetic UI with glassmorphism  

All APIs used are **100% free**, with **no API keys required**.

---

## 📌 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [Running the Backend](#-running-the-backend)
- [Running the Frontend](#-running-the-frontend)
- [Environment Variables](#-environment-variables)
- [How It Works](#-how-it-works)
- [API Documentation](#-api-documentation)
- [Future Improvements](#-future-improvements)
- [Credits](#-credits)

---

# 🚀 Features

### 🌍 **Search cities worldwide**
Uses the Open-Meteo Geocoding API to find latitude/longitude and timezone.

### ☀️ **Real-time weather**
Displays:
- Temperature
- “Feels like” temperature
- Humidity
- Precipitation
- Wind speed & direction

### 📅 **5-day forecast**
Auto-calculated using Open-Meteo daily predictions.

### 🌙 **Day/Night weather icons**
Dynamic icons using `react-icons/wi`, mapped from Open-Meteo weather codes.

### ✨ **Modern UI + animations**
- Glass card UI
- Responsive layout
- Floating weather icons
- Gradient backgrounds

### ⚡ **Fast API with caching**
The backend caches responses for 5 minutes to avoid unnecessary API calls.

---

# 🧰 Tech Stack

## **Frontend**
- React 18
- Vite
- react-icons (Weather icons)
- CSS (Glassmorphism + animations)

## **Backend**
- Node.js
- Express.js
- Axios
- dotenv
- CORS

## **External APIs**
- **Open-Meteo Forecast API** (weather)
- **Open-Meteo Geocoding API** (city → lat/lon)

## **Development Tools**
- Nodemon
- Vite dev server

---

# 🏗 Architecture

```
┌─────────────────────────────┐        ┌──────────────────────────────┐
│         React Frontend      │        │         Express Backend      │
│  - Form input (city name)   │  --->  │  /api/weather route         │
│  - Shows current + forecast │        │  - Validate city            │
│  - Icons + animations       │        │  - Geocode (Open-Meteo)     │
└─────────────────────────────┘        │  - Fetch weather            │
                                      │  - Cache results            │
                                      └────────────┬────────────────┘
                                                   │
                                                   ▼
                                    ┌─────────────────────────┐
                                    │     Open-Meteo API      │
                                    │  - Weather Forecast     │
                                    │  - Geo API              │
                                    └─────────────────────────┘
```

---

# 📁 Project Structure

```
weatherAppPMA/
│
├── backend/
│   ├── services/
│   │   ├── geocode.js
│   │   ├── fetchWeather.js
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── WeatherForm.jsx
│   │   │   ├── CurrentWeather.jsx
│   │   │   ├── ForecastCard.jsx
│   │   ├── icons.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   ├── vite.config.js
│   ├── package.json
│   ├── .env.example
│
├── .gitignore
├── README.md
```

---

# 🖼 Screenshots

(You can replace these later.)

### 🔍 Search Page

![Search Page](images/search-page.png)

### ☀ Current Weather

![Current Weather](images/current.png)

### 📅 Forecast

![Forecast](images/forecast.png)

---

# ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/adi-makes/weatherAppPMA.git
cd weatherAppPMA
```

---

# ▶ Running the Backend

## 1. Install dependencies:

```bash
cd backend
npm install
```

## 2. Create `.env`

```
PORT=4000
CACHE_TTL_SECONDS=300
```

## 3. Start server:

```bash
npm run dev
```

Server runs at:

```
http://localhost:4000
```

---

# 💻 Running the Frontend

## 1. Install dependencies:

```bash
cd frontend
npm install
```

## 2. Add environment file `.env`

```
VITE_API_BASE=http://localhost:4000
```

## 3. Start React app:

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# 🔍 How It Works

### Step 1 — User enters a city

- Input validation
- Prevents long/invalid queries

### Step 2 — Backend searches for city

`geocode.js` → Open-Meteo Geocoding API  
Gets:
- latitude
- longitude
- country
- timezone
- population

### Step 3 — Weather fetch

`fetchWeather.js` → Open-Meteo Forecast API  
Returns:
- current weather
- hourly data
- sunrise & sunset
- 5-day forecast

### Step 4 — Cache layer

Responses cached in-memory for 5 mins.

### Step 5 — Frontend displays data

Using:
- Weather icons
- Glass cards
- Animations
- Responsive layout

---

# 📡 API Documentation

## **GET `/api/weather?city=CityName`**

### Parameters

| Name   | Required | Description                       |
|--------|----------|-----------------------------------|
| `city` | ✔ yes    | City name (e.g., "London", "Mumbai") |

### Success Response

```json
{
  "location": {
    "name": "Mumbai",
    "country": "India",
    "latitude": 19.07,
    "longitude": 72.88,
    "timezone": "Asia/Kolkata"
  },
  "weather": {
    "current": {
      "temperature": 29.3,
      "windspeed": 4.2,
      "weathercode": 2
    },
    "daily": [
      {
        "date": "2025-11-12",
        "temp_max": 31.2,
        "temp_min": 24.1,
        "weathercode": 3
      }
    ]
  }
}
```

### Error Responses

**404 - Location not found**
```json
{ "error": "Location not found." }
```

**500 - Internal server error**
```json
{ "error": "Server error. Try again later." }
```

---

# 🚀 Future Improvements

Here are some enhancements you can add:

- 🌐 **User Geolocation Weather**
- ☁ Weather animations (rain, thunder, snow)
- 🔖 Save favorite cities
- 🌓 Dark/Light theme toggle
- 📦 Offline mode (localStorage cache)
- 📊 Charts for temperature trends

---

# 🙌 Credits

- **Open-Meteo API** – free weather + geocoding
- **react-icons** – animated weather icons
- **PMAccelerator** – project guidance
- Built by **YOU** — showcasing full-stack skills (React + Express)

---

# 🎉 Final Note

This project is designed to demonstrate:

- Clean code
- Full-stack understanding
- API integrations
- Input validation
- UI/UX sense
- Real-world application structure

---