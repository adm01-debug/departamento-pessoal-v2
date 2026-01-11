// V16-044: Performance Monitor
interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private timers = new Map<string, number>();

  start(name: string): void {
    this.timers.set(name, performance.now());
  }

  end(name: string): number {
    const startTime = this.timers.get(name);
    if (!startTime) return 0;
    
    const duration = performance.now() - startTime;
    this.metrics.push({ name, duration, timestamp: Date.now() });
    this.timers.delete(name);
    
    if (duration > 1000) {
      console.warn(`Slow operation: ${name} took ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }

  measure<T>(name: string, fn: () => T): T {
    this.start(name);
    const result = fn();
    this.end(name);
    return result;
  }

  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.start(name);
    const result = await fn();
    this.end(name);
    return result;
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getAverageTime(name: string): number {
    const relevant = this.metrics.filter(m => m.name === name);
    if (relevant.length === 0) return 0;
    return relevant.reduce((sum, m) => sum + m.duration, 0) / relevant.length;
  }

  clear(): void {
    this.metrics = [];
    this.timers.clear();
  }

  report(): void {
    const grouped = this.metrics.reduce((acc, m) => {
      if (!acc[m.name]) acc[m.name] = [];
      acc[m.name].push(m.duration);
      return acc;
    }, {} as Record<string, number[]>);

    console.group('Performance Report');
    Object.entries(grouped).forEach(([name, durations]) => {
      const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
      const max = Math.max(...durations);
      console.log(`${name}: avg=${avg.toFixed(2)}ms, max=${max.toFixed(2)}ms, count=${durations.length}`);
    });
    console.groupEnd();
  }
}

export const perfMonitor = new PerformanceMonitor();
export default perfMonitor;
