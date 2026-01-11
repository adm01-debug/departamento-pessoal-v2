// V15-091: src/hooks/useBattery.ts
import { useState, useEffect } from 'react';

interface BatteryState {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  supported: boolean;
}

export function useBattery(): BatteryState {
  const [battery, setBattery] = useState<BatteryState>({
    charging: false,
    chargingTime: 0,
    dischargingTime: 0,
    level: 1,
    supported: false,
  });

  useEffect(() => {
    let batteryManager: any = null;

    const updateBattery = (bm: any) => {
      setBattery({
        charging: bm.charging,
        chargingTime: bm.chargingTime,
        dischargingTime: bm.dischargingTime,
        level: bm.level,
        supported: true,
      });
    };

    const getBattery = async () => {
      try {
        if ('getBattery' in navigator) {
          batteryManager = await (navigator as any).getBattery();
          updateBattery(batteryManager);
          
          batteryManager.addEventListener('chargingchange', () => updateBattery(batteryManager));
          batteryManager.addEventListener('levelchange', () => updateBattery(batteryManager));
        }
      } catch (error) {
        console.warn('Battery API not supported');
      }
    };

    getBattery();
    return () => {
      if (batteryManager) {
        batteryManager.removeEventListener('chargingchange', () => {});
        batteryManager.removeEventListener('levelchange', () => {});
      }
    };
  }, []);

  return battery;
}
