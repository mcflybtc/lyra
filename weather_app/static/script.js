// Cache para armazenar consultas recentes
const weatherCache = {};

// Elementos da UI
const weatherForm = document.getElementById('weatherForm');
const cityInput = document.getElementById('city');
const weatherResult = document.getElementById('weatherResult');

// Configurações
const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutos

// Inicialização
initApp();

function initApp() {
    // Tenta detectar localização automaticamente
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
            },
            error => {
                console.log('Geolocation error:', error);
                loadLastSearches();
            }
        );
    } else {
        loadLastSearches();
    }
}

weatherForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const city = cityInput.value.trim();
    
    if (!city) return;
    
    await fetchWeather(city);
});

async function fetchWeather(city) {
    try {
        // Verifica cache primeiro
        if (weatherCache[city] && (Date.now() - weatherCache[city].timestamp) < CACHE_EXPIRY) {
            displayWeather(weatherCache[city].data);
            return;
        }
        
        weatherResult.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Carregando...</span></div>';
        
        const response = await fetch('/get_weather', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `city=${encodeURIComponent(city)}`
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        if (data.cod !== 200) throw new Error(data.message || 'Cidade não encontrada');
        
        // Atualiza cache
        weatherCache[city] = {
            data: data,
            timestamp: Date.now()
        };
        
        saveLastSearch(city);
        displayWeather(data);
    } catch (error) {
        console.error('Error:', error);
        weatherResult.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    }
}

async function fetchWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(`/get_weather?lat=${lat}&lon=${lon}`);
        const data = await response.json();
        
        if (data.cod === 200) {
            cityInput.value = data.name;
            displayWeather(data);
        }
    } catch (error) {
        console.error('Geolocation weather fetch error:', error);
    }
}

function displayWeather(data) {
    weatherResult.innerHTML = '';
    
    // Animação de fade-in
    weatherResult.style.opacity = 0;
    
    setTimeout(() => {
        weatherResult.innerHTML = `
            <div class="weather-card">
                <h2>${data.name}, ${data.sys.country}</h2>
                <div class="weather-main">
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" 
                         alt="${data.weather[0].description}">
                    <span class="temperature">${Math.round(data.main.temp)}°C</span>
                </div>
                <p class="weather-desc">${capitalizeFirstLetter(data.weather[0].description)}</p>
                <div class="weather-details">
                    <p><i class="bi bi-thermometer"></i> Sensação: ${Math.round(data.main.feels_like)}°C</p>
                    <p><i class="bi bi-droplet"></i> Umidade: ${data.main.humidity}%</p>
                    <p><i class="bi bi-wind"></i> Vento: ${Math.round(data.wind.speed * 3.6)} km/h</p>
                    <p><i class="bi bi-sunrise"></i> Nascer do sol: ${formatTime(data.sys.sunrise)}</p>
                    <p><i class="bi bi-sunset"></i> Pôr do sol: ${formatTime(data.sys.sunset)}</p>
                </div>
            </div>
        `;
        
        weatherResult.style.opacity = 1;
    }, 100);
}

// Funções auxiliares
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatTime(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString();
}

function saveLastSearch(city) {
    const searches = JSON.parse(localStorage.getItem('lastSearches') || '[]');
    searches.unshift(city);
    localStorage.setItem('lastSearches', JSON.stringify(searches.slice(0, 3)));
}

function loadLastSearches() {
    const searches = JSON.parse(localStorage.getItem('lastSearches') || '[]');
    if (searches.length > 0) {
        // Mostra sugestões de cidades pesquisadas anteriormente
    }
}
