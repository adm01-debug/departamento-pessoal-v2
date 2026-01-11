// V15-094: src/hooks/useNetwork.ts
import { useState, useEffect, useCallback } from 'react';

interface NetworkState {
  online: boolean;
  downlink?: number;
  effectiveType?: '2g' | '3g' | '4g' | 'slow-2g';
  rtt?: number;
  saveData?: boolean;
  type?: string;
}

export function useNetwork(): NetworkState {
  const [state, setState] = useState<NetworkState>({
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
  });

  const updateNetworkInfo = useCallback(() => {
    const connection = (navigator as any).connection || 
                       (navigator as any).mozConnection || 
                       (navigator as any).webkitConnection;

    setState({
      online: navigator.onLine,
      downlink: connection?.downlink,
      effectiveType: connection?.effectiveType,
      rtt: connection?.rtt,
      saveData: connection?.saveData,
      type: connection?.type,
    });
  }, []);

  useEffect(() => {
    updateNetworkInfo();

    window.addEventListener('online', updateNetworkInfo);
    window.addEventListener('offline', updateNetworkInfo);

    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateNetworkInfo);
    }

    return () => {
      window.removeEventListener('online', updateNetworkInfo);
      window.removeEventListener('offline', updateNetworkInfo);
      if (connection) {
        connection.removeEventListener('change', updateNetworkInfo);
      }
    };
  }, [updateNetworkInfo]);

  return state;
}
