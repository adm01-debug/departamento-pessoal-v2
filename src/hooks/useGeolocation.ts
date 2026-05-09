import { useState, useCallback } from 'react';

interface GeolocationState {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    error: null,
    loading: false,
  });

  const getPosition = useCallback(async (options?: PositionOptions): Promise<GeolocationPosition> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error = 'Geolocalização não suportada pelo navegador.';
        setState(prev => ({ ...prev, loading: false, error }));
        reject(new Error(error));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState({
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            },
            error: null,
            loading: false,
          });
          resolve(position);
        },
        (error) => {
          let errorMsg = 'Erro ao obter localização.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMsg = 'Permissão de localização negada.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg = 'Posição indisponível.';
              break;
            case error.TIMEOUT:
              errorMsg = 'Tempo limite esgotado.';
              break;
          }
          setState(prev => ({ ...prev, loading: false, error: errorMsg }));
          reject(new Error(errorMsg));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
          ...options
        }
      );
    });
  }, []);

  return { ...state, getPosition };
}
