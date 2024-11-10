// Cache the DOM elements for reuse
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const weatherInfo = document.getElementById('weather-info');

// Replace with your actual API key (preferably secure this key in a backend server)
const apiKey = 'd1c64b9fc44ead67d0e6760c4ad55275';

// Event listeners for search button and 'Enter' key
searchButton.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

function handleSearch() {
    const city = searchInput.value.trim();
    if (city) {
        getWeatherData(city);
    }
}

function getWeatherData(city) {
    const weatherEndpoint = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastEndpoint = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    // Run both fetches in parallel
    Promise.all([fetch(weatherEndpoint), fetch(forecastEndpoint)])
        .then(async ([weatherResponse, forecastResponse]) => {
            if (!weatherResponse.ok) {
                throw new Error('City not found.');
            }

            const weatherData = await weatherResponse.json();
            const forecastData = await forecastResponse.json();

            displayWeatherData(weatherData);
            displayForecastData(forecastData);
        })
        .catch(error => {
            weatherInfo.innerHTML = `<p>${error.message}</p>`;
        });
}

function displayWeatherData(data) {
    weatherInfo.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p><strong>Temperature:</strong> ${data.main.temp} &deg;C</p>
        <p><strong>Weather:</strong> ${data.weather[0].description}</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
    `;
}

function displayForecastData(data) {
    // Clear any previous forecast data
    const forecastInfo = document.createElement('div');
    forecastInfo.classList.add('forecast');
    weatherInfo.appendChild(forecastInfo);

    // Display forecast for the next 3 days at noon
    const forecastList = data.list.filter(forecast => forecast.dt_txt.includes('12:00:00'));
    forecastList.slice(0, 3).forEach(forecast => {
        const forecastDiv = document.createElement('div');
        forecastDiv.innerHTML = `
            <p><strong>${new Date(forecast.dt_txt).toDateString()}</strong></p>
            <p><strong>Temp:</strong> ${forecast.main.temp} &deg;C</p>
            <p><strong>Weather:</strong> ${forecast.weather[0].description}</p>
        `;
        forecastInfo.appendChild(forecastDiv);
    });
}
