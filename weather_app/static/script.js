document.getElementById('weatherForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const city = document.getElementById('city').value;
    
    fetch('/get_weather', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `city=${encodeURIComponent(city)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.cod === 200) {
            const resultDiv = document.getElementById('weatherResult');
            resultDiv.innerHTML = `
                <h2>${data.name}, ${data.sys.country}</h2>
                <p>Temperatura: ${Math.round(data.main.temp)}°C</p>
                <p>Sensação térmica: ${Math.round(data.main.feels_like)}°C</p>
                <p>Umidade: ${data.main.humidity}%</p>
                <p>Condição: ${data.weather[0].description}</p>
                <p>Vento: ${Math.round(data.wind.speed * 3.6)} km/h</p>
            `;
        } else {
            alert('Cidade não encontrada. Verifique o nome e tente novamente.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ocorreu um erro ao buscar a previsão do tempo.');
    });
});
