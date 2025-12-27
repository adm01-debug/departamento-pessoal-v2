import { useState, useEffect, useCallback } from 'react';

interface Position { latitude: number; longitude: number; accuracy: number; }

export function useGeolocation(options?: PositionOptions) {
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getPosition = useCallback(() => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy });
        setLoading(false);
      },
      (err) => { setError(err.message); setLoading(false); },
      options
    );
  }, [options]);

  useEffect(() => { getPosition(); }, [getPosition]);

  return { position, error, loading, refresh: getPosition };
}
export default useGeolocation;
