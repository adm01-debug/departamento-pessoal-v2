/**
 * Shared test helpers and mock data factories for telemetry tests
 */

export interface MockTelemetryRow {
  id: string;
  operation: string;
  table_name: string | null;
  rpc_name: string | null;
  duration_ms: number;
  record_count: number | null;
  query_limit: number | null;
  query_offset: number | null;
  count_mode: string | null;
  severity: string;
  error_message: string | null;
  user_id: string | null;
  created_at: string;
}

let counter = 0;

export function createMockRow(overrides: Partial<MockTelemetryRow> = {}): MockTelemetryRow {
  counter++;
  return {
    id: `row-${counter}-${Math.random().toString(36).slice(2, 8)}`,
    operation: "SELECT",
    table_name: "colaboradores",
    rpc_name: null,
    duration_ms: 500,
    record_count: 10,
    query_limit: 100,
    query_offset: 0,
    count_mode: null,
    severity: "normal",
    error_message: null,
    user_id: "user-123",
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

export function createSlowRow(overrides: Partial<MockTelemetryRow> = {}): MockTelemetryRow {
  return createMockRow({ severity: "slow", duration_ms: 4500, ...overrides });
}

export function createVerySlowRow(overrides: Partial<MockTelemetryRow> = {}): MockTelemetryRow {
  return createMockRow({ severity: "very_slow", duration_ms: 12000, ...overrides });
}

export function createErrorRow(overrides: Partial<MockTelemetryRow> = {}): MockTelemetryRow {
  return createMockRow({
    severity: "error",
    duration_ms: 0,
    error_message: "connection timeout",
    ...overrides,
  });
}

export function createBulkRows(count: number, factory: (i: number) => Partial<MockTelemetryRow> = () => ({})): MockTelemetryRow[] {
  return Array.from({ length: count }, (_, i) => createMockRow(factory(i)));
}

export function createMixedSeverityRows(counts: { normal?: number; slow?: number; very_slow?: number; error?: number }): MockTelemetryRow[] {
  const rows: MockTelemetryRow[] = [];
  for (let i = 0; i < (counts.normal || 0); i++) rows.push(createMockRow());
  for (let i = 0; i < (counts.slow || 0); i++) rows.push(createSlowRow());
  for (let i = 0; i < (counts.very_slow || 0); i++) rows.push(createVerySlowRow());
  for (let i = 0; i < (counts.error || 0); i++) rows.push(createErrorRow());
  return rows;
}

export function createTimeDistributedRows(
  hoursBack: number,
  countPerHour: number,
  severity: string = "slow"
): MockTelemetryRow[] {
  const rows: MockTelemetryRow[] = [];
  const now = Date.now();
  for (let h = 0; h < hoursBack; h++) {
    for (let i = 0; i < countPerHour; i++) {
      const offset = h * 60 * 60 * 1000 + i * (60 * 60 * 1000 / countPerHour);
      rows.push(createMockRow({
        severity,
        duration_ms: severity === "very_slow" ? 10000 : 4000,
        created_at: new Date(now - offset).toISOString(),
      }));
    }
  }
  return rows;
}

// Telemetry logic functions extracted for unit testing
export function formatDuration(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
  return `${ms}ms`;
}

export function calculateStats(rows: MockTelemetryRow[]) {
  const verySlow = rows.filter(r => r.severity === "very_slow").length;
  const slow = rows.filter(r => r.severity === "slow").length;
  const errors = rows.filter(r => r.severity === "error").length;
  const avgDuration = rows.length > 0
    ? Math.round(rows.reduce((s, r) => s + r.duration_ms, 0) / rows.length)
    : 0;
  return { verySlow, slow, errors, avgDuration };
}

export function calculateTopOffenders(rows: MockTelemetryRow[]) {
  const tableStats = new Map<string, { count: number; totalMs: number; maxMs: number }>();
  for (const r of rows) {
    const key = r.rpc_name || r.table_name || "unknown";
    const prev = tableStats.get(key) || { count: 0, totalMs: 0, maxMs: 0 };
    tableStats.set(key, {
      count: prev.count + 1,
      totalMs: prev.totalMs + r.duration_ms,
      maxMs: Math.max(prev.maxMs, r.duration_ms),
    });
  }
  return [...tableStats.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 8);
}

export function calculateTimeSeries(
  rows: MockTelemetryRow[],
  timeFilter: string
) {
  if (rows.length === 0) return [];

  const bucketMs = timeFilter === "1h" ? 5 * 60 * 1000
    : timeFilter === "6h" ? 30 * 60 * 1000
    : timeFilter === "24h" ? 60 * 60 * 1000
    : 6 * 60 * 60 * 1000;

  const buckets = new Map<number, { slow: number; very_slow: number; error: number }>();

  for (const r of rows) {
    const ts = new Date(r.created_at).getTime();
    const bucket = Math.floor(ts / bucketMs) * bucketMs;
    const prev = buckets.get(bucket) || { slow: 0, very_slow: 0, error: 0 };
    if (r.severity === "slow") prev.slow++;
    else if (r.severity === "very_slow") prev.very_slow++;
    else if (r.severity === "error") prev.error++;
    buckets.set(bucket, prev);
  }

  return [...buckets.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([ts, data]) => ({ ts, ...data }));
}

export function calculateSeverityDistribution(rows: MockTelemetryRow[]) {
  const counts: Record<string, number> = {};
  for (const r of rows) {
    counts[r.severity] = (counts[r.severity] || 0) + 1;
  }
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

export function getTimeThreshold(timeFilter: string): string {
  const now = new Date();
  switch (timeFilter) {
    case "1h": return new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    case "6h": return new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString();
    case "24h": return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    case "7d": return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    default: return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  }
}
