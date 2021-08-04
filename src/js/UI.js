import getWeather from "./weather/weather";
import events from "./libraries/events";
import unitPreference from "./weather/units";

export default (function UI() {
  const createInfo = function createWeatherInfo(name, data, text = data) {
    const para = document.createElement("p");
    para.classList.add(name);
    para.textContent = text;
    return para;
  };

  const colorBackground = (clouds, temp, unit) => {
    if (/clear|few/.test(clouds)) {
      if ((unit == "C" && temp > 21) || (unit == "F" && temp > 69)) {
        weatherWrapper.classList.add("goodWeather");
      }
    } else {
      weatherWrapper.classList.remove("goodWeather");
    }
  };

  const displayWeather = async (getWeatherPromise) => {
    weatherWrapper.classList.remove("goodWeather");
    const weather = await handleError(getWeatherPromise);
    colorBackground(weather.clouds, weather.temp, weather.units);
    weatherWrapper.innerHTML = "";
    weatherWrapper.append(
      createInfo("city", weather.city),
      createInfo("clouds", weather.clouds),
      createInfo(
        "tempDisplay",
        weather.temp,
        `Temperature: ${weather.temp} ${weather.units}`
      ),
      createInfo(
        "tempDisplay",
        weather.feelsLike,
        `Feels like: ${weather.feelsLike} ${weather.units}`
      )
    );
  };

  const message = function displayMessage(message) {
    if (message) {
      messageDisplay.textContent = message;
      messageDisplay.classList.add("visible");
      weatherWrapper.innerHTML = "";
    } else {
      messageDisplay.classList.remove("visible");
    }
  };

  const handleError = async function handleWeatherError(promise) {
    return promise
      .then((weather) => {
        message("");
        return weather;
      })
      .catch((err) => {
        message(err);
        return Promise.reject(`@ handleError: ${err}`);
      });
  };

  const processForm = async (e) => {
    e.preventDefault();

    if (searchInput.checkValidity()) {
      displayWeather(getWeather(searchInput.value));
    } else {
      message(searchInput.validationMessage);
    }
  };

  const unitsCheckbox = (unit) => {
    let unitButton = document.querySelector(`input[value=${unit}]`);
    unitButton.checked = true;
  };

  const loadingStatus = (isLoading) => {
    if (isLoading) {
      message("LOADING");
    } else {
      message("");
    }
  };

  // Cache dom
  const weatherWrapper = document.querySelector("#weatherWrapper");

  const messageDisplay = document.querySelector(".message");

  const searchForm = document.querySelector('form[name="searchWeather"]');
  const searchInput = searchForm.querySelector("input");

  const fahrenheitBttn = document.querySelector("#fahrenheit");
  const celsiusBttn = document.querySelector("#celsius");
  const unitButtons = [fahrenheitBttn, celsiusBttn];

  async function init() {
    // with either 'C' or 'F' clicked by the user
    events.subscribe("Update unit checkbox", unitsCheckbox);

    events.subscribe("Loading", loadingStatus);

    // from default location
    displayWeather(getWeather());

    searchForm.addEventListener("submit", processForm);

    // allow choosing celsius or fahrenheit
    unitButtons.forEach((button) =>
      button.addEventListener("click", async (e) => {
        unitPreference.set(e.target.value);
        const currentSearch = weatherWrapper.querySelector(".city").textContent;
        displayWeather(getWeather(currentSearch));
      })
    );
  }

  return {
    init,
  };
})();
