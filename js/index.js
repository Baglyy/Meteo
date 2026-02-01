const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "3e7299c23658d0ecf1f47f785b5f4b81";

document.addEventListener("DOMContentLoaded", () => {
  load("header", "header.html");
  load("footer", "footer.html");
});

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = cityInput.value;

  if (city) {
    try {
      const weatherData = await getWeatherData(city);
      displayWeatherInfo(weatherData);
    } catch (error) {
      console.error(error);
      displayError(error.message);
    }
  } else {
    displayError("Veuillez rentrer le nom d'une ville");
  }
});

async function getWeatherData(city) {
  const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("Impossible d'afficher les données météorologiques");
  }

  return await response.json();
}

function displayWeatherInfo(data) {
  const {
    name: city,
    main: { temp, humidity, feels_like, temp_min, temp_max, pressure },
    wind: { speed } = {},
    weather: [{ id }],
  } = data;

  card.textContent = "";
  card.style.display = "flex";
  card.style.flexDirection = "column";

  const emojiDisplay = document.createElement("h1");
  const cityDisplay = document.createElement("h2");
  const tempDisplay = document.createElement("p");
  const humidityDisplay = document.createElement("p");

  emojiDisplay.textContent = getWeatherEmoji(id);
  cityDisplay.textContent = city;
  tempDisplay.textContent = `${(temp - 273.15).toFixed(1)} °C`;
  humidityDisplay.textContent = `Humidité: ${humidity} %`;

  emojiDisplay.classList.add("weatherEmoji");
  cityDisplay.classList.add("cityDisplay");
  tempDisplay.classList.add("tempDisplay");
  humidityDisplay.classList.add("humidityDisplay");

  const detailsBtn = document.createElement("button");
  detailsBtn.type = "button";
  detailsBtn.textContent = "Plus de détails";
  detailsBtn.classList.add("detailsBtn");

  const detailsDiv = document.createElement("div");
  detailsDiv.classList.add("details");
  detailsDiv.style.display = "none";
  detailsDiv.innerHTML = `
    <p>Ressenti: ${(feels_like - 273.15).toFixed(1)} °C</p>
    <p>Min / Max: ${(temp_min - 273.15).toFixed(1)} °C / ${(temp_max - 273.15).toFixed(1)} °C</p>
    <p>Pression: ${pressure} hPa</p>
    <p>Vent: ${speed ?? "?"} m/s</p>
  `;

  detailsBtn.addEventListener("click", () => {
    const isOpen = detailsDiv.style.display === "block";
    detailsDiv.style.display = isOpen ? "none" : "block";
    detailsBtn.textContent = isOpen ? "Plus de détails" : "Masquer les détails";
  });

  card.appendChild(emojiDisplay);
  card.appendChild(cityDisplay);
  card.appendChild(tempDisplay);
  card.appendChild(humidityDisplay);
  card.appendChild(detailsBtn);
  card.appendChild(detailsDiv);
}

function getWeatherEmoji(weatherId) {
  switch (true) {
    case weatherId >= 200 && weatherId < 300:
      return "⛈️";
    case weatherId >= 300 && weatherId < 400:
      return "🌧️";
    case weatherId >= 500 && weatherId < 600:
      return "🌧️";
    case weatherId >= 600 && weatherId < 700:
      return "❄️";
    case weatherId >= 700 && weatherId < 800:
      return "≋";
    case weatherId === 800:
      return "☀️";
    case weatherId >= 801 && weatherId < 810:
      return "☁️";
    default:
      return "❓";
  }
}

function displayError(message) {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");

  card.textContent = "";
  card.style.display = "flex";
  card.appendChild(errorDisplay);

  lastWeatherData = null;
  detailsBtn.style.display = "none";
  details.style.display = "none";
  details.textContent = "";
}

async function load(id, file) {
  const response = await fetch(file);
  document.getElementById(id).innerHTML = await response.text();
}
