import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Weather = () => {
   
    const [weather, setWeather] = useState(null);
    const [city, setCity] = useState('Delhi');
    const [error, setError] = useState('');

    const apiKey = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;

    const fetchWeather = async () => {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
                params: { q: city, appid: apiKey }
            });
            if (response.data.cod !== 200) {
                throw new Error('City not found');
            }
            const tempCelsius = response.data.main.temp - 273.15;
            const condition = response.data.weather[0].main;
            setWeather({ temp: tempCelsius.toFixed(2), condition });
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchWeather();
    }, [city]);

    return (
        <div className="weather-container">
            <input 
                type="text" 
                value={city} 
                onChange={(e) => setCity(e.target.value)} 
                className="form-control my-2"
            />
            <button onClick={fetchWeather} className="btn btn-primary">Get Weather</button>
            {error && <p className="text-danger">{error}</p>}
            {weather && (
                <div className="mt-3">
                    <p>Temperature: {weather.temp} °C</p>
                    <p>Condition: {weather.condition}</p>
                </div>
            )}
        </div>
    );
};

export default Weather;
