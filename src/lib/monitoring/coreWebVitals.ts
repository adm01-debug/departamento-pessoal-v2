// coreWebVitals - Monitoring & Analytics
export const coreWebVitals = {
  enabled: process.env.NODE_ENV === 'production',
  
  init(): void {
    if (!this.enabled) return;
    console.log('[Monitoring] coreWebVitals initialized');
  },

  track(event: string, properties?: Record<string, any>): void {
    if (!this.enabled) return;
    console.log('[coreWebVitals] Track:', event, properties);
  },

  capture(error: Error, context?: Record<string, any>): void {
    if (!this.enabled) return;
    console.error('[coreWebVitals] Error:', error, context);
  },

  measure(metric: string, value: number): void {
    if (!this.enabled) return;
    console.log('[coreWebVitals] Metric:', metric, value);
  },
};

export default coreWebVitals;
