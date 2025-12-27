// logRocketConfig - Monitoring & Analytics
export const logRocketConfig = {
  enabled: process.env.NODE_ENV === 'production',
  
  init(): void {
    if (!this.enabled) return;
    console.log('[Monitoring] logRocketConfig initialized');
  },

  track(event: string, properties?: Record<string, any>): void {
    if (!this.enabled) return;
    console.log('[logRocketConfig] Track:', event, properties);
  },

  capture(error: Error, context?: Record<string, any>): void {
    if (!this.enabled) return;
    console.error('[logRocketConfig] Error:', error, context);
  },

  measure(metric: string, value: number): void {
    if (!this.enabled) return;
    console.log('[logRocketConfig] Metric:', metric, value);
  },
};

export default logRocketConfig;
