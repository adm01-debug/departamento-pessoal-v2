// V18-DEVOPS-003/004: Monitoring e Health Checks
export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: Record<string, { status: boolean; latency?: number; message?: string }>;
}

export async function checkHealth(): Promise<HealthStatus> {
  const checks: HealthStatus['checks'] = {};
  
  // Database check
  try {
    const start = Date.now();
    const response = await fetch('/api/health/db');
    checks.database = { status: response.ok, latency: Date.now() - start };
  } catch {
    checks.database = { status: false, message: 'Database unreachable' };
  }

  // API check
  try {
    const start = Date.now();
    const response = await fetch('/api/health');
    checks.api = { status: response.ok, latency: Date.now() - start };
  } catch {
    checks.api = { status: false, message: 'API unreachable' };
  }

  // Memory check
  if (typeof performance !== 'undefined' && 'memory' in performance) {
    const memory = (performance as { memory: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
    const usage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
    checks.memory = { status: usage < 0.9, message: `${Math.round(usage * 100)}% used` };
  }

  const allHealthy = Object.values(checks).every(c => c.status);
  const anyFailed = Object.values(checks).some(c => !c.status);

  return {
    status: allHealthy ? 'healthy' : anyFailed ? 'unhealthy' : 'degraded',
    timestamp: new Date().toISOString(),
    checks
  };
}

// Error tracking
export interface ErrorReport {
  message: string;
  stack?: string;
  timestamp: string;
  url: string;
  userAgent: string;
  extra?: Record<string, unknown>;
}

export function reportError(error: Error, extra?: Record<string, unknown>): void {
  const report: ErrorReport = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    extra
  };
  console.error('[Error Report]', report);
  // Integrar com Sentry/Datadog aqui
}

// Performance tracking
export function trackPerformance(name: string, fn: () => void): void {
  const start = performance.now();
  fn();
  const duration = performance.now() - start;
  console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
}
