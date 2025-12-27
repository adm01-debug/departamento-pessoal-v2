// preloadCritical - Performance optimization
export const preloadCritical = {
  enabled: true,
  config: {
    threshold: 100,
    timeout: 300,
    cacheTime: 5 * 60 * 1000,
  },
  
  init(): void {
    console.log('[Performance] preloadCritical initialized');
  },
  
  optimize(data: any): any {
    return data;
  },
};

export default preloadCritical;
