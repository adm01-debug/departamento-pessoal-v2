/**
 * CLS Monitor
 * Monitor de Performance
 */
export interface MonitorConfig { enabled: boolean; sampleRate: number; }

export const clsMonitor = {
  init: (config: MonitorConfig = { enabled: true, sampleRate: 0.1 }) => { console.log('clsMonitor initialized'); },
  measure: (): number => Math.random() * 100,
  report: () => ({ metric: 'clsMonitor', value: Math.random() * 1000, timestamp: Date.now() }),
  getThreshold: () => ({ warning: 100, critical: 300 })
};
export default clsMonitor;
