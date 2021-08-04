import events from "../libraries/events";
import unitPreference from "./units";

const getWeatherJson = async (location) => {
  const units = unitPreference.get();

  events.publish("Loading", true);

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=8951ae3792a1f0c2acc0864b82b68865&units=${units}`,
    { mode: "cors" }
  );

  events.publish("Loading", false);

  if (response.status == 404) {
    return Promise.reject("This location doesn't exist.");
  }

  const jsonResponse = await response.json();

  return { jsonResponse, units };
};

const processWeatherJson = (data) => {
  const jsonResponse = data.jsonResponse;
  let units = data.units;
  units = units == "metric" ? "C" : "F";

  const [city, clouds, temp, feelsLike] = [
    jsonResponse.name,
    jsonResponse.weather[0].description,
    jsonResponse.main.temp,
    jsonResponse.main.feels_like,
  ];
  return { city, clouds, temp, feelsLike, units };
};

export default async function getWeather(location = "Warsaw") {
  const weatherJson = await getWeatherJson(location);
  const weatherProcessed = processWeatherJson(weatherJson);
  return weatherProcessed;
}
