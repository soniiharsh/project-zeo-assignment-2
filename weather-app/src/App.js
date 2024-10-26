import "./App.css";
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const api = {
  key: "05707a22df032d6fdaa0bb7fa172dc22",
  base: "https://api.openweathermap.org/data/2.5/",
};

function App() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState({});
  const [tempThreshold, setTempThreshold] = useState(35);
  const [alertMessage, setAlertMessage] = useState("");
  const [unit, setUnit] = useState("C"); // Default to Celsius

  const fetchWeather = async (city) => {
    const response = await fetch(`${api.base}weather?q=${city}&units=metric&APPID=${api.key}`);
    const data = await response.json();
    setWeather(data);

    if (data.main.temp > tempThreshold) {
      setAlertMessage(`Alert! Temperature in ${data.name} exceeds ${tempThreshold}°C.`);
    } else {
      setAlertMessage("");
    }
  };

  const fetchForecast = async (city) => {
    const response = await fetch(`${api.base}forecast?q=${city}&units=metric&APPID=${api.key}`);
    const data = await response.json();
    setForecast(data);
  };

  const searchPressed = () => {
    fetchWeather(search);
    fetchForecast(search);
  };

  const convertTemperature = (temp) => {
    return unit === "C" ? temp : (temp * 9/5) + 32; // Convert to Fahrenheit
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="mb-4">Weather App</h1>

        {/* Threshold Input */}
        <div className="threshold-input-container mb-3">
          <label>Set Temperature Threshold (°C): </label>
          <input
            type="number"
            className="form-control threshold-input"
            value={tempThreshold}
            onChange={(e) => setTempThreshold(e.target.value)}
          />
        </div>

        {/* Unit Selection */}
        <div className="unit-selection mb-3">
          <label>Select Temperature Unit: </label>
          <div>
            <label>
              <input
                type="radio"
                value="C"
                checked={unit === "C"}
                onChange={() => setUnit("C")}
              />
              Celsius
            </label>
            <label className="ml-3">
              <input
                type="radio"
                value="F"
                checked={unit === "F"}
                onChange={() => setUnit("F")}
              />
              Fahrenheit
            </label>
          </div>
        </div>

        {/* Search Box */}
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter city/town..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-primary" onClick={searchPressed}>Search</button>
        </div>

        {/* Alert Message */}
        {alertMessage && (
          <div className="alert alert-warning mt-3" role="alert">
            {alertMessage}
          </div>
        )}

        {/* Weather Info */}
        {typeof weather.main !== "undefined" ? (
          <div className="weather-info bg-light p-3 rounded">
            <h2>{weather.name}</h2>
            <p>Temperature: {convertTemperature(weather.main.temp).toFixed(2)}°{unit}</p>
            <p>Humidity: {weather.main.humidity}%</p>
            <p>Wind Speed: {weather.wind.speed} m/s</p>
            <p>{weather.weather[0].main} ({weather.weather[0].description})</p>
          </div>
        ) : (
          ""
        )}

        {/* Forecast Info */}
        {typeof forecast.list !== "undefined" && (
          <div className="forecast mt-4">
            <h2>3-Day Forecast</h2>
            {forecast.list.slice(0, 3).map((item) => (
              <div key={item.dt} className="forecast-item border p-2 my-2 rounded">
                <p>Date: {new Date(item.dt * 1000).toLocaleDateString()}</p>
                <p>Temp: {convertTemperature(item.main.temp).toFixed(2)}°{unit}</p>
                <p>Humidity: {item.main.humidity}%</p>
                <p>Wind Speed: {item.wind.speed} m/s</p>
                <p>{item.weather[0].main} ({item.weather[0].description})</p>
              </div>
            ))}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
