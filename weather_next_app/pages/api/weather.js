import axios from 'axios';

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutos
const weatherCache = new Map();

export default async function handler(req, res) {
  const { city } = req.query;
  if (!city) {
    return res.status(400).json({ message: 'Cidade não fornecida' });
  }

  // Verifica cache
  const cached = weatherCache.get(city);
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    return res.status(200).json(cached.data);
  }

  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: city,
        appid: process.env.OPENWEATHER_API_KEY,
        units: 'metric',
        lang: 'pt_br'
      }
    });
    
    // Atualiza cache
    weatherCache.set(city, {
      data: response.data,
      timestamp: Date.now()
    });
    
    res.status(200).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Erro ao buscar previsão';
    
    res.status(status).json({ 
      message,
      details: error.response?.data 
    });
  }
}
