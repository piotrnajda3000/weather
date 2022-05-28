import getWeather from "./weather/weather";
import unitPreference from "./weather/units";

import events from "./events";

// Cache dom
const weatherWrapper = document.querySelector("#weatherWrapper");

const messageDisplay = document.querySelector(".message");

const searchForm = document.querySelector('form[name="searchWeather"]');
const searchInput = searchForm.querySelector("input");

const fahrenheitBttn = document.querySelector("#fahrenheit");
const celsiusBttn = document.querySelector("#celsius");
const unitButtons = [fahrenheitBttn, celsiusBttn];

// https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
export function htmlToElement(html) {
  let template = document.createElement("template");
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}

export default (function UI() {
  const colorBackground = (clouds, temp, unit) => {
    const isGoodWeather = /clear|few/.test(clouds) 
    if (isGoodWeather) {
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
      htmlToElement(`<p class='city'>${weather.city}</p>`),
      htmlToElement(`<p class='clouds'>${weather.clouds}</p>`),
      htmlToElement(`<p class='tempDisplay'>Temperature: ${weather.temp} ${weather.units}</p>`),
      htmlToElement(`<p class='tempDisplay'>Feels like: ${weather.feelsLike} ${weather.units}`)
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

  async function init() {
    events.subscribe("Update unit checkbox", unitsCheckbox);

    events.subscribe("Loading", loadingStatus);

    displayWeather(getWeather()); // from default location

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
