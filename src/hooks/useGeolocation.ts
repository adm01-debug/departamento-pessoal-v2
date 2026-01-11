// V15-454
import { useState, useEffect } from 'react';
interface GeolocationState { latitude: number | null; longitude: number | null; accuracy: number | null; error: string | null; loading: boolean; }
export function useGeolocation(options?: PositionOptions) {
  const [state, setState] = useState<GeolocationState>({ latitude: null, longitude: null, accuracy: null, error: null, loading: true });
  const getPosition = () => { if (!navigator.geolocation) { setState(s => ({ ...s, error: 'Geolocation not supported', loading: false })); return; } setState(s => ({ ...s, loading: true })); navigator.geolocation.getCurrentPosition(pos => setState({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy, error: null, loading: false }), err => setState(s => ({ ...s, error: err.message, loading: false })), options); };
  useEffect(() => { getPosition(); }, []);
  return { ...state, refresh: getPosition };
}
