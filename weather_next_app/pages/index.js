import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`/api/weather?city=${city}`);
      setWeather(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao buscar previsão');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-gray-900">
      <h1 className="text-3xl font-bold mb-6">Previsão do Tempo</h1>
      <div className="w-full max-w-md">
        <div className="flex">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Digite o nome da cidade"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={fetchWeather}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            Buscar
          </button>
        </div>
        {loading && (
          <div className="flex justify-center mt-6">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {error && <p className="mt-4 text-red-500">{error}</p>}
        {weather && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} className="w-12 h-12"/>
              {weather.name}, {weather.sys.country}
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <p><span className="font-medium">Temp:</span> {Math.round(weather.main.temp)}°C</p>
              <p><span className="font-medium">Sensação:</span> {Math.round(weather.main.feels_like)}°C</p>
              <p><span className="font-medium">Umidade:</span> {weather.main.humidity}%</p>
              <p><span className="font-medium">Condição:</span> {weather.weather[0].description}</p>
              <p><span className="font-medium">Vento:</span> {Math.round(weather.wind.speed * 3.6)} km/h</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
