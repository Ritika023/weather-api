// src/App.js
import React, { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const fetchCoordinates = async () => {
    try {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found.");
        setWeather(null);
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];
      fetchWeather(latitude, longitude, name, country);
    } catch (err) {
      setError("Error fetching coordinates.");
    }
  };

  const fetchWeather = async (lat, lon, name, country) => {
    try {
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      const weatherData = await weatherRes.json();
      setWeather({
        ...weatherData.current_weather,
        location: `${name}, ${country}`,
      });
      setError("");
    } catch (err) {
      setError("Error fetching weather.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim() !== "") {
      fetchCoordinates();
    }
  };

  return (
    <div className="app">
      <h1>🌤️ Weather App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Get Weather</button>
      </form>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-card">
          <h2>{weather.location}</h2>
          <p>🌡️ Temperature: {weather.temperature}°C</p>
          <p>🌬️ Wind: {weather.windspeed} km/h</p>
          <p>🧭 Direction: {weather.winddirection}°</p>
        </div>
      )}
    </div>
  );
}

export default App;
