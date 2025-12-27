// sentryConfig - Monitoring & Analytics
export const sentryConfig = {
  enabled: process.env.NODE_ENV === 'production',
  
  init(): void {
    if (!this.enabled) return;
    console.log('[Monitoring] sentryConfig initialized');
  },

  track(event: string, properties?: Record<string, any>): void {
    if (!this.enabled) return;
    console.log('[sentryConfig] Track:', event, properties);
  },

  capture(error: Error, context?: Record<string, any>): void {
    if (!this.enabled) return;
    console.error('[sentryConfig] Error:', error, context);
  },

  measure(metric: string, value: number): void {
    if (!this.enabled) return;
    console.log('[sentryConfig] Metric:', metric, value);
  },
};

export default sentryConfig;
