import { useState } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
} from '@mui/material';

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
    <Container maxWidth="sm">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Previsão do Tempo
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            fullWidth
            label="Digite o nome da cidade"
            variant="outlined"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
          />
          <Button
            variant="contained"
            onClick={fetchWeather}
            disabled={loading}
            sx={{ ml: 1, py: 1.8 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Buscar'}
          </Button>
        </Box>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        {weather && (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h5" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} style={{ width: 50, height: 50 }}/>
                {weather.name}, {weather.sys.country}
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Typography>Temp: {Math.round(weather.main.temp)}°C</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Sensação: {Math.round(weather.main.feels_like)}°C</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Umidade: {weather.main.humidity}%</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Condição: {weather.weather[0].description}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Vento: {Math.round(weather.wind.speed * 3.6)} km/h</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
}
