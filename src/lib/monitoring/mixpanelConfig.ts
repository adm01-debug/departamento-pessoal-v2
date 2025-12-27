// mixpanelConfig - Monitoring & Analytics
export const mixpanelConfig = {
  enabled: process.env.NODE_ENV === 'production',
  
  init(): void {
    if (!this.enabled) return;
    console.log('[Monitoring] mixpanelConfig initialized');
  },

  track(event: string, properties?: Record<string, any>): void {
    if (!this.enabled) return;
    console.log('[mixpanelConfig] Track:', event, properties);
  },

  capture(error: Error, context?: Record<string, any>): void {
    if (!this.enabled) return;
    console.error('[mixpanelConfig] Error:', error, context);
  },

  measure(metric: string, value: number): void {
    if (!this.enabled) return;
    console.log('[mixpanelConfig] Metric:', metric, value);
  },
};

export default mixpanelConfig;
