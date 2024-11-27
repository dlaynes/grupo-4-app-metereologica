import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Estado para almacenar la información del clima actual
  const [weather, setWeather] = useState(null);
  // Estado para almacenar el nombre de la ciudad seleccionada
  const [city, setCity] = useState('Lima');
  // Estado para almacenar el pronóstico de 5 días
  const [forecast, setForecast] = useState([]);
  // Estado para manejar la ciudad seleccionada en el selector
  const [selectedCity, setSelectedCity] = useState('Lima');
  // Estado para manejar errores
  const [error, setError] = useState(null);

  // Lista de ciudades en Perú para el selector
  const citiesPeru = [
    'Lima', 'Arequipa', 'Cusco', 'Trujillo', 'Chiclayo', 'Piura', 'Iquitos', 'Puno', 'Tacna', 'Chimbote'
  ];

  // Función para manejar el cambio de ciudad en el selector
  const handleCityChange = (event) => {
    setSelectedCity(event.target.value); // Cambia la ciudad seleccionada
  };

  useEffect(() => {
    if (selectedCity) {
      // Fetch del clima actual para la ciudad seleccionada
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${selectedCity},pe&appid=93db6f1521b6333accff4379479b51c4&units=metric`)
        .then(response => response.json())
        .then(data => {
          if (data.cod === 200) {
            setWeather(data.main); // Guarda la información del clima actual
            setCity(selectedCity);  // Actualiza el nombre de la ciudad
          } else {
            throw new Error(data.message); // Lanza un error si la respuesta no es válida
          }
        })
        .catch(error => {
          setError(error.message); // Maneja el error si ocurre
        });

      // Fetch del pronóstico de 4 días
      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity},pe&appid=93db6f1521b6333accff4379479b51c4&units=metric`)
        .then(response => response.json())
        .then(data => {
          if (data.cod === '200') {
            // Filtra solo las predicciones a las 12:00 del día
            const forecastData = data.list.filter(item => item.dt_txt.includes("12:00:00"));
            setForecast(forecastData); // Guarda las predicciones
          } else {
            throw new Error(data.message); // Lanza un error si la respuesta no es válida
          }
        })
        .catch(error => {
          setError(error.message); // Maneja el error si ocurre
        });
    }
  }, [selectedCity]); // Vuelve a ejecutarse cuando la ciudad seleccionada cambia

  // Función para obtener la URL del ícono del clima
  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // Devuelve la URL del ícono correspondiente
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Clima del día</h1>
        <p>Elija una ciudad de la lista para ver el tiempo actual y el pronóstico.</p>
        {/* Selector de ciudades */}
        <div className="city-selector">
          <label htmlFor="city">Elige una ciudad: </label>
          <select id="city" value={selectedCity} onChange={handleCityChange}>
            {citiesPeru.map((cityName) => (
              <option key={cityName} value={cityName}>
                {cityName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Información del clima actual */}
      <div className="weather-container">
        {error ? (
          <p>Error: {error}</p> // Muestra un mensaje de error si ocurre un problema
        ) : weather ? (
          <div className="weather-info">
            <h2>{city}</h2>
            <div className="weather-details">
              <div className="current-weather">
                <p>{weather.temp}°C</p> {/* Muestra la temperatura actual */}
                <p>{weather.humidity}% Humedad</p> {/* Muestra la humedad actual */}
              
              </div>
              <div className="weather-icon">
                <img src={getWeatherIconUrl('04d')} alt="Icono de clima" /> {/* Muestra el ícono del clima actual */}
              </div>
            </div>
          </div>
        ) : (
          <p>Cargando...</p> // Muestra un mensaje de carga mientras se obtienen los datos
        )}
      </div>
      <h3>Pronóstico</h3>
      {/* Pronóstico de 5 días */}
      <div className="forecast">
  
  {forecast.length > 0 ? (
    forecast.slice(0, 4).map((day, index) => ( // Limita a los primeros 4 días
      <div className="forecast-day" key={index}>
        <p>{new Date(day.dt_txt).toLocaleDateString()}</p> {/* Muestra la fecha de la predicción */}
        <p>{day.weather[0].description}</p> {/* Muestra la descripción del clima */}
        <p>{day.main.temp_max} / {day.main.temp_min} °C</p> {/* Muestra la temperatura máxima y mínima */}
        <p>{day.main.humidity}% Humedad</p> {/* Muestra la humedad */}
        <img src={getWeatherIconUrl(day.weather[0].icon)} alt="Icono de clima" /> {/* Muestra el ícono del clima para ese día */}
      </div>
    ))
  ) : (
    <p>Cargando pronóstico...</p> // Muestra un mensaje de carga mientras se obtienen los datos del pronóstico
  )}
</div>





    </div>
  );
}

export default App;
