const apikey = "90e71833209960a74b2be02308f5582b";

const weatherDataEl = document.getElementById("weather-data");
const cityInputEl = document.getElementById("city-input");

const formEl = document.querySelector("form");

const forecastEl = document.getElementById("forecast");

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = cityInputEl.value;
  console.log(city);
  getWeatherData(city);
});

const getWeatherData = async (city) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`
    );
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}&units=metric`
    );
    if (!response.ok) {
      throw new Error("Weather data not available");
    }
    const weatherData = await response.json();
    console.log(weatherData);
    const forecastData = await forecastResponse.json();
    console.log(forecastData);
    const temperature = Math.round(weatherData.main.temp, 1);
    const description = weatherData.weather[0].description;
    const icon = weatherData.weather[0].icon;
    const details = [
      `Feels like: <br/> ${
        Math.round(weatherData.main.feels_like * 10) / 10
      }°C`,
      `Humidity: <br/> ${weatherData.main.humidity}%`,
      `Wind speed: <br/> ${Math.round(weatherData.wind.speed * 10) / 10} m/s`,
    ];
    weatherDataEl.querySelector(
      ".icon"
    ).innerHTML = `<img src="http://openweathermap.org/img/wn/${icon}.png" alt="weather icon">`;
    weatherDataEl.querySelector(
      ".temperature"
    ).textContent = `${temperature}°C`;
    weatherDataEl.querySelector(".description").innerHTML = description;
    weatherDataEl.querySelector(".details").innerHTML = details
      .map((detail) => `<div>${detail}</div>`)
      .join("");
    const forecast = forecastData.list
      .map((item) => {
        const date = item.dt_txt.slice(0, 10)+" "+(Number(item.dt_txt.slice(11, 13))+2).toString();
        const icon = item.weather[0].icon;
        const description = item.weather[0].description;
        return `<div class="item">
        <div class="item-date">${date}h</div>
        <div class="item-icon">
          <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
        </div>
        <div>${description}</div>
        <div class="item-temp">${Math.round(item.main.temp * 10) / 10}°C</div>
        <div><span class="material-symbols-outlined">water_drop</span></div>
        <div>${Math.round(item.pop * 100)}%</div></div>`;
      })
      .join("<br/>");
    forecastEl.innerHTML = `<div id="forecast"><h1>Forecast</h1></div> ${forecast}`;
  } catch (error) {
    console.log(error);
  }
};
