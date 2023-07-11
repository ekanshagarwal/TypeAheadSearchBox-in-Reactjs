import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";

const useFetchPromise = (query, transformData, promise, debounceWait,autoComplete) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const fetchData = useCallback(
    debounce(async (query, transformData, signal) => {
      try {
        const respone = await promise(query, signal);
        if (!respone.ok) throw new Error(respone.statusText);
        const data = await respone.json();
        setData(transformData(data));
        console.log(data);
      } catch (e) {
        console.log(e);
        if (!signal.aborted) setError(e);
      }
    }, debounceWait),
    []
  );

  useEffect(() => {
    if (!query || !autoComplete) {
      setData(null);
      setError(null);
      return;
    }
    const controller = new AbortController();
    const signal = controller.signal;

    fetchData(query, transformData, signal);

    return () => {
      controller.abort();
    };
  }, [query, transformData, fetchData, debounceWait,autoComplete]);

  return [data, setData, error];
};

export default useFetchPromise;
