// rumConfig - Monitoring & Analytics
export const rumConfig = {
  enabled: process.env.NODE_ENV === 'production',
  
  init(): void {
    if (!this.enabled) return;
    console.log('[Monitoring] rumConfig initialized');
  },

  track(event: string, properties?: Record<string, any>): void {
    if (!this.enabled) return;
    console.log('[rumConfig] Track:', event, properties);
  },

  capture(error: Error, context?: Record<string, any>): void {
    if (!this.enabled) return;
    console.error('[rumConfig] Error:', error, context);
  },

  measure(metric: string, value: number): void {
    if (!this.enabled) return;
    console.log('[rumConfig] Metric:', metric, value);
  },
};

export default rumConfig;
