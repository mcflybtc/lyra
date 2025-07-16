from flask import Flask, render_template, request
import requests
import os
from functools import lru_cache
from datetime import datetime, timedelta

app = Flask(__name__)

# Configuração da API OpenWeatherMap
API_KEY = 'sua_chave_api'  # Você precisará obter uma chave em https://openweathermap.org
BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

# Cache de 30 minutos para previsões
@lru_cache(maxsize=100)
def get_cached_weather(city: str):
    return None

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get_weather', methods=['POST', 'GET'])
def get_weather():
    # Suporte a geolocalização
    if request.method == 'GET' and 'lat' in request.args and 'lon' in request.args:
        lat = request.args.get('lat')
        lon = request.args.get('lon')
        params = {
            'lat': lat,
            'lon': lon,
            'appid': API_KEY,
            'units': 'metric',
            'lang': 'pt_br'
        }
    # Suporte a pesquisa por cidade
    else:
        city = request.form.get('city') or request.args.get('city')
        if not city:
            return {'cod': 400, 'message': 'Cidade não fornecida'}, 400
            
        params = {
            'q': city,
            'appid': API_KEY,
            'units': 'metric',
            'lang': 'pt_br'
        }
    
    # Verifica cache
    cache_key = f"{params.get('q', '')}_{params.get('lat', '')}_{params.get('lon', '')}"
    cached = get_cached_weather(cache_key)
    
    if cached:
        return cached
    
    response = requests.get(BASE_URL, params=params)
    data = response.json()
    
    # Atualiza cache
    if data.get('cod') == 200:
        get_cached_weather.cache[cache_key] = data
    
    return data

if __name__ == '__main__':
    app.run(debug=True)
