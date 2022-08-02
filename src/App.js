import React, { useState } from "react";
import useWeather from "./useWeather";

const defaultLocation = "Warsaw";

function App() {
  const [location, setLocation] = useState(defaultLocation);

  const { data, isLoading, error, doFetch } = useWeather(
    `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&APPID=8951ae3792a1f0c2acc0864b82b68865&units=metric`
  );

  const tryWeatherSearch = (e) => {
    e.preventDefault();
    if (!location) return;
    doFetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=8951ae3792a1f0c2acc0864b82b68865&units=metric`
    );
  };

  return (
    <div className="App">
      <div>{!error && data && `${data.name}, ${data.temp}`}</div>
      <div>
        <form onSubmit={tryWeatherSearch}>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button>Get weather</button>
        </form>
      </div>
      <div>
        {isLoading && "Loading..."}
        {error && `Error: ${error}`}
      </div>
    </div>
  );
}

export default App;
