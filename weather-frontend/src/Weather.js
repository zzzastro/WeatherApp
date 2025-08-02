import React, { useState } from 'react';
import axios from 'axios';
import './Weather.css';

const Weather = () => {
    const [location, setLocation] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const getWeather = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response = await axios.post('http://127.0.0.1:8000/', {
                location: location,
            });
            
            if (response.data.error) {
                throw new Error(response.data.error);
            }

            setWeatherData(response.data);
        } catch (err) {
            setError('Location not found. Please check your input and try again.');
            setWeatherData(null);
        } finally {
            setLoading(false);
        }
    };

    const getWeatherIcon = (description) => {
        const iconMap = {
            'clear': '☀️',
            'clouds': '☁️',
            'rain': '🌧️',
            'drizzle': '🌦️',
            'thunderstorm': '⛈️',
            'snow': '❄️',
            'mist': '🌫️',
            'fog': '🌫️',
        };
        
        const lowerDesc = description.toLowerCase();
        for (const [key, icon] of Object.entries(iconMap)) {
            if (lowerDesc.includes(key)) return icon;
        }
        return '🌤️';
    };

    return (
        <div className="weather-container">
            <div className="weather-card">
                <h1 className="app-title">Weather Forecast</h1>
                <p className="app-subtitle">Get accurate weather information instantly</p>
                
                <form onSubmit={getWeather} className="search-form">
                    <div className="input-group">
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Enter city name (e.g., London, Tokyo, New York)"
                            className="location-input"
                            required
                        />
                        <button type="submit" className="search-button" disabled={loading}>
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="error-message">
                        <span>⚠️</span> {error}
                    </div>
                )}

                {weatherData && weatherData.name && (
                    <div className="weather-info">
                        <div className="location-header">
                            <h2>{weatherData.name}, {weatherData.sys.country}</h2>
                            <p className="weather-description">
                                {getWeatherIcon(weatherData.weather[0].description)} 
                                {weatherData.weather[0].description.charAt(0).toUpperCase() + weatherData.weather[0].description.slice(1)}
                            </p>
                        </div>

                        <div className="temperature-display">
                            <span className="temperature">{Math.round(weatherData.main.temp)}°C</span>
                            <div className="temp-details">
                                <span>Feels like {Math.round(weatherData.main.feels_like)}°C</span>
                                <span>Min: {Math.round(weatherData.main.temp_min)}°C | Max: {Math.round(weatherData.main.temp_max)}°C</span>
                            </div>
                        </div>

                        <div className="weather-details">
                            <div className="detail-card">
                                <span className="detail-icon">💧</span>
                                <span className="detail-value">{weatherData.main.humidity}%</span>
                                <span className="detail-label">Humidity</span>
                            </div>
                            <div className="detail-card">
                                <span className="detail-icon">💨</span>
                                <span className="detail-value">{weatherData.wind.speed} m/s</span>
                                <span className="detail-label">Wind Speed</span>
                            </div>
                            <div className="detail-card">
                                <span className="detail-icon">🔽</span>
                                <span className="detail-value">{weatherData.main.pressure} hPa</span>
                                <span className="detail-label">Pressure</span>
                            </div>
                            <div className="detail-card">
                                <span className="detail-icon">👁️</span>
                                <span className="detail-value">{weatherData.visibility / 1000} km</span>
                                <span className="detail-label">Visibility</span>
                            </div>
                        </div>

                        <div className="sun-info">
                            <div className="sun-card">
                                <span className="sun-icon">🌅</span>
                                <span className="sun-label">Sunrise</span>
                                <span className="sun-time">
                                    {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
                                        hour: '2-digit', 
                                        minute: '2-digit',
                                        hour12: true 
                                    })}
                                </span>
                            </div>
                            <div className="sun-card">
                                <span className="sun-icon">🌇</span>
                                <span className="sun-label">Sunset</span>
                                <span className="sun-time">
                                    {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('en-US', { 
                                        hour: '2-digit', 
                                        minute: '2-digit',
                                        hour12: true 
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Weather;
