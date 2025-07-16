from flask import Flask, render_template, request
import requests
import os

app = Flask(__name__)

# Configuração da API OpenWeatherMap
API_KEY = 'sua_chave_api'  # Você precisará obter uma chave em https://openweathermap.org
BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get_weather', methods=['POST'])
def get_weather():
    city = request.form['city']
    params = {
        'q': city,
        'appid': API_KEY,
        'units': 'metric',
        'lang': 'pt_br'
    }
    response = requests.get(BASE_URL, params=params)
    data = response.json()
    return data

if __name__ == '__main__':
    app.run(debug=True)
