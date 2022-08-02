import { useState, useEffect } from "react";

const useWeather = (initialUrl, initialData = null) => {
  const [url, setUrl] = useState(initialUrl);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [data, setData] = useState(initialData);

  useEffect(() => {
    handleError(fetchData)(setError, setIsLoading);
  }, [url]);

  async function fetchData() {
    setError(false);
    setIsLoading(true);

    const response = await fetch(url, { mode: "cors" });

    if (!response.ok) {
      return Promise.reject(`Response not ok: ${response.status}`);
    }

    const json = await response.json();

    setData({ temp: json.main.temp, name: json.name });
    setIsLoading(false);
  }

  return { data, isLoading, error, doFetch: setUrl };
};

const handleError =
  (fn) =>
  (setError, setIsLoading, ...args) =>
    fn(...args).catch((err) => {
      setIsLoading(false);
      setError(err);
      console.error(`handleError HOF: ${err}`);
    });

export default useWeather;
