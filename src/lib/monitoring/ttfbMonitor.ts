/**
 * TTFB Monitor
 * Monitor de Performance
 */
export interface MonitorConfig { enabled: boolean; sampleRate: number; }

export const ttfbMonitor = {
  init: (config: MonitorConfig = { enabled: true, sampleRate: 0.1 }) => { console.log('ttfbMonitor initialized'); },
  measure: (): number => Math.random() * 100,
  report: () => ({ metric: 'ttfbMonitor', value: Math.random() * 1000, timestamp: Date.now() }),
  getThreshold: () => ({ warning: 100, critical: 300 })
};
export default ttfbMonitor;
