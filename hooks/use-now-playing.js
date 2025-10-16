import { getNowPlaying } from "@/lib/utils";
import { useState, useEffect } from "react";

export function useNowPlaying() {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setState((prev) => ({ ...prev, loading: !prev.data, error: null }));
      try {
        const data = await getNowPlaying();
        if (isMounted) {
          setState({ data, loading: false, error: null });
        }
      } catch (err) {
        if (isMounted) {
          setState((prev) => ({ ...prev, loading: false, error: err.message }));
        }
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 15000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return state;
}
