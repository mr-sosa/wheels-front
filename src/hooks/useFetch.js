import { useState, useEffect } from 'react';

const cache = {};

export default function useFetch(url, options = {}, useCache = false) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (useCache && cache[url]) {
      setData(cache[url]);
    } else {
      setLoading(true);
      const controller = new AbortController();
      fetch(url, { ...options, signal: controller.signal })
        .then(async (response) => {
          if (response.ok) {
            const responseData = await response.json();
            if (useCache) cache[url] = responseData;
            setStatus(response.status);
            return responseData;
          } else {
            return response.status;
          }
        })
        .then((data) => {
          if (data === 404 || data === 500) {
            setData(null);
          } else {
            setData(data);
          }
        })
        .catch((err) => {
          console.error(err);
          setData(null);
          setStatus(null);
          setError(err);
        })
        .finally(() => setLoading(false));
      return () => {
        controller.abort();
        setLoading(false);
      };
    }
    console.log('fetch');
  }, [url, useCache]);

  return { loading, data, error, status };
}
