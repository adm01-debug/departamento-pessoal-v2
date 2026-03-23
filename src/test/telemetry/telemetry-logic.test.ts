import { describe, it, expect } from "vitest";
import {
  createMockRow, createSlowRow, createVerySlowRow, createErrorRow,
  createBulkRows, createMixedSeverityRows, createTimeDistributedRows,
  formatDuration, classifySeverity, calculateStats, calculateTopOffenders,
  calculateTimeSeries, calculateSeverityDistribution, calculateDurationBuckets,
  calculateTableAlerts, getTimeThreshold, generateCSVContent, buildTelemetryLogLine,
  type MockTelemetryRow,
} from "./telemetry-helpers";

// ============================================================
// 1. formatDuration
// ============================================================
describe("formatDuration", () => {
  it("formata milissegundos abaixo de 1s", () => {
    expect(formatDuration(0)).toBe("0ms");
    expect(formatDuration(1)).toBe("1ms");
    expect(formatDuration(500)).toBe("500ms");
    expect(formatDuration(999)).toBe("999ms");
  });

  it("formata valores iguais ou acima de 1s", () => {
    expect(formatDuration(1000)).toBe("1.0s");
    expect(formatDuration(1500)).toBe("1.5s");
    expect(formatDuration(2000)).toBe("2.0s");
    expect(formatDuration(3456)).toBe("3.5s");
    expect(formatDuration(10000)).toBe("10.0s");
    expect(formatDuration(99999)).toBe("100.0s");
  });

  it("formata valores de borda", () => {
    expect(formatDuration(999)).toBe("999ms");
    expect(formatDuration(1000)).toBe("1.0s");
    expect(formatDuration(1001)).toBe("1.0s");
  });

  it("formata valores grandes (minutos)", () => {
    expect(formatDuration(60000)).toBe("60.0s");
    expect(formatDuration(120000)).toBe("120.0s");
  });

  it("formata precisão decimal corretamente", () => {
    expect(formatDuration(1100)).toBe("1.1s");
    expect(formatDuration(1050)).toBe("1.1s");
    expect(formatDuration(1049)).toBe("1.0s");
    expect(formatDuration(2750)).toBe("2.8s");
    expect(formatDuration(9999)).toBe("10.0s");
  });
});

// ============================================================
// 2. classifySeverity (edge function logic)
// ============================================================
describe("classifySeverity", () => {
  it("retorna 'ok' para queries rápidas", () => {
    expect(classifySeverity(0, false)).toBe("ok");
    expect(classifySeverity(200, false)).toBe("ok");
    expect(classifySeverity(2999, false)).toBe("ok");
  });

  it("retorna 'slow' para queries entre 3s e 8s", () => {
    expect(classifySeverity(3000, false)).toBe("slow");
    expect(classifySeverity(5000, false)).toBe("slow");
    expect(classifySeverity(7999, false)).toBe("slow");
  });

  it("retorna 'very_slow' para queries >= 8s", () => {
    expect(classifySeverity(8000, false)).toBe("very_slow");
    expect(classifySeverity(15000, false)).toBe("very_slow");
    expect(classifySeverity(60000, false)).toBe("very_slow");
  });

  it("retorna 'error' quando hasError é true, independente da duração", () => {
    expect(classifySeverity(0, true)).toBe("error");
    expect(classifySeverity(100, true)).toBe("error");
    expect(classifySeverity(5000, true)).toBe("error");
    expect(classifySeverity(10000, true)).toBe("error");
  });

  it("threshold exato de 3000ms é 'slow'", () => {
    expect(classifySeverity(3000, false)).toBe("slow");
  });

  it("threshold exato de 8000ms é 'very_slow'", () => {
    expect(classifySeverity(8000, false)).toBe("very_slow");
  });

  it("1ms abaixo de cada threshold", () => {
    expect(classifySeverity(2999, false)).toBe("ok");
    expect(classifySeverity(7999, false)).toBe("slow");
  });
});

// ============================================================
// 3. calculateStats
// ============================================================
describe("calculateStats", () => {
  it("retorna zeros para array vazio", () => {
    const stats = calculateStats([]);
    expect(stats.verySlow).toBe(0);
    expect(stats.slow).toBe(0);
    expect(stats.errors).toBe(0);
    expect(stats.avgDuration).toBe(0);
  });

  it("conta severidades corretamente", () => {
    const rows = createMixedSeverityRows({ normal: 5, slow: 3, very_slow: 2, error: 1 });
    const stats = calculateStats(rows);
    expect(stats.verySlow).toBe(2);
    expect(stats.slow).toBe(3);
    expect(stats.errors).toBe(1);
  });

  it("calcula média de duração com uma row", () => {
    const rows = [createMockRow({ duration_ms: 1000 })];
    expect(calculateStats(rows).avgDuration).toBe(1000);
  });

  it("calcula média de duração com múltiplas rows", () => {
    const rows = [
      createMockRow({ duration_ms: 100 }),
      createMockRow({ duration_ms: 200 }),
      createMockRow({ duration_ms: 300 }),
    ];
    expect(calculateStats(rows).avgDuration).toBe(200);
  });

  it("arredonda média corretamente", () => {
    const rows = [
      createMockRow({ duration_ms: 100 }),
      createMockRow({ duration_ms: 200 }),
      createMockRow({ duration_ms: 201 }),
    ];
    expect(calculateStats(rows).avgDuration).toBe(167);
  });

  it("lida com todas as rows sendo erro (duration_ms = 0)", () => {
    const rows = createBulkRows(10, () => ({ severity: "error", duration_ms: 0 }));
    const stats = calculateStats(rows);
    expect(stats.errors).toBe(10);
    expect(stats.avgDuration).toBe(0);
  });

  it("lida com durações muito altas", () => {
    const rows = [createMockRow({ duration_ms: 999999 })];
    expect(calculateStats(rows).avgDuration).toBe(999999);
  });

  it("conta apenas severidades conhecidas", () => {
    const rows = [
      createMockRow({ severity: "normal" }),
      createMockRow({ severity: "custom" }),
      createSlowRow(),
    ];
    const stats = calculateStats(rows);
    expect(stats.slow).toBe(1);
    expect(stats.verySlow).toBe(0);
    expect(stats.errors).toBe(0);
  });

  it("processa centenas de rows sem erro", () => {
    const rows = createBulkRows(500, (i) => ({
      severity: i % 4 === 0 ? "slow" : i % 4 === 1 ? "very_slow" : i % 4 === 2 ? "error" : "normal",
      duration_ms: (i + 1) * 100,
    }));
    const stats = calculateStats(rows);
    expect(stats.slow).toBe(125);
    expect(stats.verySlow).toBe(125);
    expect(stats.errors).toBe(125);
    expect(stats.avgDuration).toBeGreaterThan(0);
  });
});

// ============================================================
// 4. calculateTopOffenders
// ============================================================
describe("calculateTopOffenders", () => {
  it("retorna vazio para array vazio", () => {
    expect(calculateTopOffenders([])).toEqual([]);
  });

  it("agrupa por table_name", () => {
    const rows = [
      createMockRow({ table_name: "colaboradores", duration_ms: 100 }),
      createMockRow({ table_name: "colaboradores", duration_ms: 200 }),
      createMockRow({ table_name: "empresas", duration_ms: 300 }),
    ];
    const top = calculateTopOffenders(rows);
    expect(top.length).toBe(2);
    expect(top[0][0]).toBe("colaboradores");
    expect(top[0][1].count).toBe(2);
  });

  it("prioriza rpc_name sobre table_name", () => {
    const rows = [createMockRow({ rpc_name: "check_brute_force", table_name: "login_attempts" })];
    const top = calculateTopOffenders(rows);
    expect(top[0][0]).toBe("check_brute_force");
  });

  it("usa 'unknown' quando nem rpc_name nem table_name existem", () => {
    const rows = [createMockRow({ rpc_name: null, table_name: null })];
    const top = calculateTopOffenders(rows);
    expect(top[0][0]).toBe("unknown");
  });

  it("calcula totalMs corretamente", () => {
    const rows = [
      createMockRow({ table_name: "t1", duration_ms: 100 }),
      createMockRow({ table_name: "t1", duration_ms: 300 }),
    ];
    expect(calculateTopOffenders(rows)[0][1].totalMs).toBe(400);
  });

  it("calcula maxMs corretamente", () => {
    const rows = [
      createMockRow({ table_name: "t1", duration_ms: 100 }),
      createMockRow({ table_name: "t1", duration_ms: 9000 }),
      createMockRow({ table_name: "t1", duration_ms: 500 }),
    ];
    expect(calculateTopOffenders(rows)[0][1].maxMs).toBe(9000);
  });

  it("limita a 8 offenders", () => {
    const rows: MockTelemetryRow[] = [];
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15 - i; j++) {
        rows.push(createMockRow({ table_name: `table_${i}` }));
      }
    }
    expect(calculateTopOffenders(rows).length).toBe(8);
  });

  it("ordena por count descendente", () => {
    const rows = [
      ...createBulkRows(5, () => ({ table_name: "rare" })),
      ...createBulkRows(20, () => ({ table_name: "frequent" })),
      ...createBulkRows(10, () => ({ table_name: "medium" })),
    ];
    const top = calculateTopOffenders(rows);
    expect(top[0][0]).toBe("frequent");
    expect(top[1][0]).toBe("medium");
    expect(top[2][0]).toBe("rare");
  });

  it("lida com mix de rpc e table_name", () => {
    const rows = [
      createMockRow({ rpc_name: "fn_calc", table_name: null }),
      createMockRow({ rpc_name: null, table_name: "users" }),
      createMockRow({ rpc_name: "fn_calc", table_name: "other" }),
    ];
    const top = calculateTopOffenders(rows);
    expect(top.find(t => t[0] === "fn_calc")![1].count).toBe(2);
  });
});

// ============================================================
// 5. calculateTimeSeries
// ============================================================
describe("calculateTimeSeries", () => {
  it("retorna vazio para array vazio", () => {
    expect(calculateTimeSeries([], "24h")).toEqual([]);
  });

  it("agrupa por buckets de 1h para timeFilter '24h'", () => {
    const now = Date.now();
    const rows = [
      createMockRow({ severity: "slow", created_at: new Date(now).toISOString() }),
      createMockRow({ severity: "slow", created_at: new Date(now - 30 * 60 * 1000).toISOString() }),
      createMockRow({ severity: "very_slow", created_at: new Date(now - 2 * 60 * 60 * 1000).toISOString() }),
    ];
    const series = calculateTimeSeries(rows, "24h");
    expect(series.length).toBeGreaterThanOrEqual(1);
    const totalSlow = series.reduce((s, b) => s + b.slow, 0);
    expect(totalSlow).toBe(2);
  });

  it("usa buckets de 5min para timeFilter '1h'", () => {
    const now = Date.now();
    const rows = [
      createMockRow({ severity: "slow", created_at: new Date(now).toISOString() }),
      createMockRow({ severity: "slow", created_at: new Date(now - 3 * 60 * 1000).toISOString() }),
    ];
    const series = calculateTimeSeries(rows, "1h");
    const totalSlow = series.reduce((s, b) => s + b.slow, 0);
    expect(totalSlow).toBe(2);
  });

  it("usa buckets de 30min para timeFilter '6h'", () => {
    const now = Date.now();
    const rows = [
      createMockRow({ severity: "error", created_at: new Date(now).toISOString() }),
      createMockRow({ severity: "error", created_at: new Date(now - 15 * 60 * 1000).toISOString() }),
    ];
    const series = calculateTimeSeries(rows, "6h");
    const totalErrors = series.reduce((s, b) => s + b.error, 0);
    expect(totalErrors).toBe(2);
  });

  it("usa buckets de 6h para timeFilter '7d'", () => {
    const rows = createTimeDistributedRows(48, 1, "very_slow");
    const series = calculateTimeSeries(rows, "7d");
    const totalVerySlow = series.reduce((s, b) => s + b.very_slow, 0);
    expect(totalVerySlow).toBe(48);
  });

  it("ordena por timestamp ascendente", () => {
    const now = Date.now();
    const rows = [
      createMockRow({ severity: "slow", created_at: new Date(now - 5 * 60 * 60 * 1000).toISOString() }),
      createMockRow({ severity: "slow", created_at: new Date(now).toISOString() }),
      createMockRow({ severity: "slow", created_at: new Date(now - 10 * 60 * 60 * 1000).toISOString() }),
    ];
    const series = calculateTimeSeries(rows, "24h");
    for (let i = 1; i < series.length; i++) {
      expect(series[i].ts).toBeGreaterThanOrEqual(series[i - 1].ts);
    }
  });

  it("ignora severidades 'normal' na contagem", () => {
    const rows = [createMockRow({ severity: "normal" })];
    const series = calculateTimeSeries(rows, "24h");
    expect(series.length).toBe(1);
    expect(series[0].slow).toBe(0);
    expect(series[0].very_slow).toBe(0);
    expect(series[0].error).toBe(0);
  });

  it("processa centenas de rows distribuídas no tempo", () => {
    const rows = createTimeDistributedRows(24, 10, "slow");
    const series = calculateTimeSeries(rows, "24h");
    const totalSlow = series.reduce((s, b) => s + b.slow, 0);
    expect(totalSlow).toBe(240);
  });
});

// ============================================================
// 6. calculateSeverityDistribution
// ============================================================
describe("calculateSeverityDistribution", () => {
  it("retorna vazio para array vazio", () => {
    expect(calculateSeverityDistribution([])).toEqual([]);
  });

  it("conta cada severidade corretamente", () => {
    const rows = createMixedSeverityRows({ normal: 10, slow: 5, very_slow: 3, error: 2 });
    const dist = calculateSeverityDistribution(rows);
    const map = Object.fromEntries(dist.map(d => [d.name, d.value]));
    expect(map.normal).toBe(10);
    expect(map.slow).toBe(5);
    expect(map.very_slow).toBe(3);
    expect(map.error).toBe(2);
  });

  it("lida com severidade única", () => {
    const rows = createBulkRows(50, () => ({ severity: "slow" }));
    const dist = calculateSeverityDistribution(rows);
    expect(dist.length).toBe(1);
    expect(dist[0]).toEqual({ name: "slow", value: 50 });
  });

  it("lida com severidades customizadas/desconhecidas", () => {
    const rows = [createMockRow({ severity: "custom_severity" })];
    const dist = calculateSeverityDistribution(rows);
    expect(dist).toEqual([{ name: "custom_severity", value: 1 }]);
  });

  it("soma corretamente centenas de rows", () => {
    const rows = createBulkRows(300, (i) => ({
      severity: i % 3 === 0 ? "slow" : i % 3 === 1 ? "very_slow" : "error",
    }));
    const dist = calculateSeverityDistribution(rows);
    const total = dist.reduce((s, d) => s + d.value, 0);
    expect(total).toBe(300);
  });
});

// ============================================================
// 7. calculateDurationBuckets (NEW)
// ============================================================
describe("calculateDurationBuckets", () => {
  it("retorna vazio para array vazio", () => {
    expect(calculateDurationBuckets([], "24h")).toEqual([]);
  });

  it("calcula média e máximo corretamente em bucket único", () => {
    const now = Date.now();
    const rows = [
      createMockRow({ duration_ms: 3000, created_at: new Date(now).toISOString() }),
      createMockRow({ duration_ms: 5000, created_at: new Date(now - 1000).toISOString() }),
      createMockRow({ duration_ms: 10000, created_at: new Date(now - 2000).toISOString() }),
    ];
    const buckets = calculateDurationBuckets(rows, "24h");
    expect(buckets.length).toBe(1);
    expect(buckets[0].mediaMs).toBe(6000);
    expect(buckets[0].maxMs).toBe(10000);
  });

  it("separa em múltiplos buckets quando timestamps distantes", () => {
    const now = Date.now();
    const rows = [
      createMockRow({ duration_ms: 3000, created_at: new Date(now).toISOString() }),
      createMockRow({ duration_ms: 5000, created_at: new Date(now - 3 * 60 * 60 * 1000).toISOString() }),
    ];
    const buckets = calculateDurationBuckets(rows, "24h");
    expect(buckets.length).toBeGreaterThanOrEqual(2);
  });

  it("ordena por timestamp ascendente", () => {
    const rows = createTimeDistributedRows(6, 2, "slow");
    const buckets = calculateDurationBuckets(rows, "24h");
    for (let i = 1; i < buckets.length; i++) {
      expect(buckets[i].ts).toBeGreaterThanOrEqual(buckets[i - 1].ts);
    }
  });

  it("usa buckets de 5min para 1h", () => {
    const now = Date.now();
    const rows = [
      createMockRow({ duration_ms: 1000, created_at: new Date(now).toISOString() }),
      createMockRow({ duration_ms: 2000, created_at: new Date(now - 60 * 1000).toISOString() }),
    ];
    const buckets = calculateDurationBuckets(rows, "1h");
    expect(buckets.length).toBe(1);
    expect(buckets[0].mediaMs).toBe(1500);
  });

  it("maxMs nunca é menor que mediaMs", () => {
    const rows = createBulkRows(50, (i) => ({
      duration_ms: 1000 + i * 200,
      created_at: new Date(Date.now() - i * 60 * 1000).toISOString(),
    }));
    const buckets = calculateDurationBuckets(rows, "6h");
    for (const b of buckets) {
      expect(b.maxMs).toBeGreaterThanOrEqual(b.mediaMs);
    }
  });
});

// ============================================================
// 8. calculateTableAlerts (NEW)
// ============================================================
describe("calculateTableAlerts", () => {
  it("retorna vazio para array vazio", () => {
    expect(calculateTableAlerts([])).toEqual([]);
  });

  it("conta alertas por tabela", () => {
    const rows = [
      ...createBulkRows(5, () => ({ table_name: "users" })),
      ...createBulkRows(3, () => ({ table_name: "orders" })),
    ];
    const alerts = calculateTableAlerts(rows);
    expect(alerts[0].name).toBe("users");
    expect(alerts[0].alertas).toBe(5);
    expect(alerts[1].name).toBe("orders");
    expect(alerts[1].alertas).toBe(3);
  });

  it("limita a 8 tabelas", () => {
    const rows: MockTelemetryRow[] = [];
    for (let i = 0; i < 12; i++) {
      rows.push(createMockRow({ table_name: `table_${i}` }));
    }
    expect(calculateTableAlerts(rows).length).toBe(8);
  });

  it("ordena por alertas descendente", () => {
    const rows = [
      ...createBulkRows(10, () => ({ table_name: "top" })),
      ...createBulkRows(2, () => ({ table_name: "bottom" })),
      ...createBulkRows(5, () => ({ table_name: "mid" })),
    ];
    const alerts = calculateTableAlerts(rows);
    expect(alerts[0].name).toBe("top");
    expect(alerts[1].name).toBe("mid");
    expect(alerts[2].name).toBe("bottom");
  });

  it("usa rpc_name quando disponível", () => {
    const rows = [createMockRow({ rpc_name: "fn_test", table_name: "ignored" })];
    const alerts = calculateTableAlerts(rows);
    expect(alerts[0].name).toBe("fn_test");
  });
});

// ============================================================
// 9. getTimeThreshold
// ============================================================
describe("getTimeThreshold", () => {
  it("retorna ISO string para cada filtro", () => {
    for (const filter of ["1h", "6h", "24h", "7d"]) {
      const result = getTimeThreshold(filter);
      expect(() => new Date(result)).not.toThrow();
      expect(new Date(result).getTime()).toBeLessThan(Date.now());
    }
  });

  it("1h é ~1 hora atrás", () => {
    const threshold = new Date(getTimeThreshold("1h")).getTime();
    expect(Math.abs(threshold - (Date.now() - 60 * 60 * 1000))).toBeLessThan(1000);
  });

  it("6h é ~6 horas atrás", () => {
    const threshold = new Date(getTimeThreshold("6h")).getTime();
    expect(Math.abs(threshold - (Date.now() - 6 * 60 * 60 * 1000))).toBeLessThan(1000);
  });

  it("24h é ~24 horas atrás", () => {
    const threshold = new Date(getTimeThreshold("24h")).getTime();
    expect(Math.abs(threshold - (Date.now() - 24 * 60 * 60 * 1000))).toBeLessThan(1000);
  });

  it("7d é ~7 dias atrás", () => {
    const threshold = new Date(getTimeThreshold("7d")).getTime();
    expect(Math.abs(threshold - (Date.now() - 7 * 24 * 60 * 60 * 1000))).toBeLessThan(1000);
  });

  it("filtro desconhecido usa 24h como padrão", () => {
    const threshold = new Date(getTimeThreshold("unknown")).getTime();
    expect(Math.abs(threshold - (Date.now() - 24 * 60 * 60 * 1000))).toBeLessThan(1000);
  });

  it("thresholds são progressivamente mais antigos", () => {
    const t1h = new Date(getTimeThreshold("1h")).getTime();
    const t6h = new Date(getTimeThreshold("6h")).getTime();
    const t24h = new Date(getTimeThreshold("24h")).getTime();
    const t7d = new Date(getTimeThreshold("7d")).getTime();
    expect(t1h).toBeGreaterThan(t6h);
    expect(t6h).toBeGreaterThan(t24h);
    expect(t24h).toBeGreaterThan(t7d);
  });
});

// ============================================================
// 10. generateCSVContent (NEW)
// ============================================================
describe("generateCSVContent", () => {
  it("gera header correto", () => {
    const csv = generateCSVContent([]);
    expect(csv).toContain("Data/Hora;Operação;Tabela/RPC;Duração (ms);Severidade");
  });

  it("gera uma linha por row", () => {
    const rows = createBulkRows(5);
    const csv = generateCSVContent(rows);
    const lines = csv.split("\n");
    expect(lines.length).toBe(6); // header + 5 rows
  });

  it("usa ponto-e-vírgula como delimitador", () => {
    const rows = [createSlowRow()];
    const csv = generateCSVContent(rows);
    expect(csv.split("\n")[1].split(";").length).toBe(10);
  });

  it("escapa aspas duplas em error_message", () => {
    const rows = [createMockRow({ error_message: 'error "with" quotes' })];
    const csv = generateCSVContent(rows);
    expect(csv).toContain('""with"" quotes');
  });

  it("usa '-' para valores nulos", () => {
    const rows = [createMockRow({ record_count: null, query_limit: null })];
    const csv = generateCSVContent(rows);
    const dataLine = csv.split("\n")[1];
    expect(dataLine).toContain("-");
  });

  it("inclui operação e table_name corretos", () => {
    const rows = [createMockRow({ operation: "INSERT", table_name: "test_table" })];
    const csv = generateCSVContent(rows);
    expect(csv).toContain("INSERT");
    expect(csv).toContain("test_table");
  });

  it("usa rpc_name quando table_name é null", () => {
    const rows = [createMockRow({ table_name: null, rpc_name: "fn_test" })];
    const csv = generateCSVContent(rows);
    expect(csv).toContain("fn_test");
  });

  it("usa '-' quando ambos table_name e rpc_name são null", () => {
    const rows = [createMockRow({ table_name: null, rpc_name: null })];
    const csv = generateCSVContent(rows);
    const dataLine = csv.split("\n")[1];
    const fields = dataLine.split(";");
    expect(fields[2]).toBe("-");
  });

  it("processa 1000 rows sem erro", () => {
    const rows = createBulkRows(1000);
    const csv = generateCSVContent(rows);
    expect(csv.split("\n").length).toBe(1001);
  });
});

// ============================================================
// 11. buildTelemetryLogLine (NEW)
// ============================================================
describe("buildTelemetryLogLine", () => {
  it("gera log para query ok", () => {
    const line = buildTelemetryLogLine({
      operation: "select", table: "products", durationMs: 200,
      status: "ok", recordCount: 50, limit: 50, offset: 0, countMode: "planned",
    });
    expect(line).toContain("✅");
    expect(line).toContain("select:products");
    expect(line).toContain("200ms");
    expect(line).toContain("records=50");
  });

  it("gera log para query slow", () => {
    const line = buildTelemetryLogLine({
      operation: "select", table: "users", durationMs: 4000, status: "slow",
    });
    expect(line).toContain("🟡");
    expect(line).toContain("4000ms");
  });

  it("gera log para query very_slow", () => {
    const line = buildTelemetryLogLine({
      operation: "select", table: "orders", durationMs: 12000, status: "very_slow",
    });
    expect(line).toContain("🔴");
    expect(line).toContain("12000ms");
  });

  it("gera log para query com erro", () => {
    const line = buildTelemetryLogLine({
      operation: "rpc", rpcName: "fn_calc", durationMs: 100, status: "error", error: "timeout",
    });
    expect(line).toContain("❌");
    expect(line).toContain("rpc:fn_calc");
  });

  it("usa 'unknown' quando sem table e sem rpcName", () => {
    const line = buildTelemetryLogLine({ operation: "select", durationMs: 100, status: "ok" });
    expect(line).toContain("select:unknown");
  });

  it("prioriza rpcName sobre table", () => {
    const line = buildTelemetryLogLine({
      operation: "rpc", table: "ignored", rpcName: "fn_used", durationMs: 100, status: "ok",
    });
    expect(line).toContain("rpc:fn_used");
    expect(line).not.toContain("ignored");
  });

  it("usa '-' para valores não fornecidos", () => {
    const line = buildTelemetryLogLine({ operation: "select", durationMs: 100, status: "ok" });
    expect(line).toContain("records=-");
    expect(line).toContain("limit=-");
    expect(line).toContain("offset=-");
    expect(line).toContain("count=-");
  });

  it("inclui todos os campos quando fornecidos", () => {
    const line = buildTelemetryLogLine({
      operation: "select", table: "products", durationMs: 3500, status: "slow",
      recordCount: 100, limit: 100, offset: 200, countMode: "exact",
    });
    expect(line).toContain("records=100");
    expect(line).toContain("limit=100");
    expect(line).toContain("offset=200");
    expect(line).toContain("count=exact");
  });
});

// ============================================================
// 12. Mock Data Factories
// ============================================================
describe("Mock Data Factories", () => {
  it("createMockRow gera IDs únicos", () => {
    const ids = new Set(createBulkRows(100).map(r => r.id));
    expect(ids.size).toBe(100);
  });

  it("createSlowRow tem severity slow e duration > 3000", () => {
    const row = createSlowRow();
    expect(row.severity).toBe("slow");
    expect(row.duration_ms).toBeGreaterThanOrEqual(3000);
  });

  it("createVerySlowRow tem severity very_slow e duration > 8000", () => {
    const row = createVerySlowRow();
    expect(row.severity).toBe("very_slow");
    expect(row.duration_ms).toBeGreaterThanOrEqual(8000);
  });

  it("createErrorRow tem severity error e error_message", () => {
    const row = createErrorRow();
    expect(row.severity).toBe("error");
    expect(row.error_message).toBeTruthy();
  });

  it("createMixedSeverityRows gera contagens corretas", () => {
    const rows = createMixedSeverityRows({ normal: 10, slow: 20, very_slow: 30, error: 40 });
    expect(rows.length).toBe(100);
    expect(rows.filter(r => r.severity === "normal").length).toBe(10);
    expect(rows.filter(r => r.severity === "slow").length).toBe(20);
    expect(rows.filter(r => r.severity === "very_slow").length).toBe(30);
    expect(rows.filter(r => r.severity === "error").length).toBe(40);
  });

  it("createTimeDistributedRows gera timestamps decrescentes", () => {
    const rows = createTimeDistributedRows(5, 3);
    expect(rows.length).toBe(15);
    for (const r of rows) {
      expect(new Date(r.created_at).getTime()).toBeLessThanOrEqual(Date.now());
    }
  });

  it("createBulkRows aceita factory function", () => {
    const rows = createBulkRows(50, (i) => ({ table_name: `t_${i}`, duration_ms: i * 10 }));
    expect(rows[0].table_name).toBe("t_0");
    expect(rows[49].table_name).toBe("t_49");
  });

  it("overrides funcionam corretamente", () => {
    const row = createMockRow({
      operation: "INSERT",
      table_name: "custom_table",
      duration_ms: 9999,
    });
    expect(row.operation).toBe("INSERT");
    expect(row.table_name).toBe("custom_table");
    expect(row.duration_ms).toBe(9999);
  });
});

// ============================================================
// 13. Cenários de stress e edge cases
// ============================================================
describe("Stress & Edge Cases", () => {
  it("1000 rows: stats em tempo razoável", () => {
    const rows = createBulkRows(1000, (i) => ({
      severity: ["slow", "very_slow", "error", "normal"][i % 4],
      duration_ms: i * 10,
    }));
    const start = performance.now();
    calculateStats(rows);
    calculateTopOffenders(rows);
    calculateTimeSeries(rows, "24h");
    calculateSeverityDistribution(rows);
    calculateDurationBuckets(rows, "24h");
    calculateTableAlerts(rows);
    expect(performance.now() - start).toBeLessThan(1000);
  });

  it("rows com duration_ms = 0", () => {
    const rows = createBulkRows(10, () => ({ duration_ms: 0 }));
    const stats = calculateStats(rows);
    expect(stats.avgDuration).toBe(0);
    const buckets = calculateDurationBuckets(rows, "24h");
    expect(buckets[0].mediaMs).toBe(0);
    expect(buckets[0].maxMs).toBe(0);
  });

  it("rows com duration_ms máximo (MAX_SAFE_INTEGER)", () => {
    const rows = [createMockRow({ duration_ms: Number.MAX_SAFE_INTEGER })];
    const stats = calculateStats(rows);
    expect(stats.avgDuration).toBe(Number.MAX_SAFE_INTEGER);
  });

  it("todas as severidades com mesma contagem", () => {
    const rows = createMixedSeverityRows({ normal: 25, slow: 25, very_slow: 25, error: 25 });
    const dist = calculateSeverityDistribution(rows);
    expect(dist.length).toBe(4);
    for (const d of dist) {
      expect(d.value).toBe(25);
    }
  });

  it("single row com todos os campos null", () => {
    const row = createMockRow({
      table_name: null, rpc_name: null, record_count: null,
      query_limit: null, query_offset: null, count_mode: null,
      error_message: null, user_id: null,
    });
    const top = calculateTopOffenders([row]);
    expect(top[0][0]).toBe("unknown");
    const csv = generateCSVContent([row]);
    expect(csv).toBeTruthy();
  });

  it("rows com created_at no futuro", () => {
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const rows = [createMockRow({ severity: "slow", created_at: futureDate })];
    const series = calculateTimeSeries(rows, "24h");
    expect(series.length).toBe(1);
    expect(series[0].slow).toBe(1);
  });

  it("rows com created_at muito antigo", () => {
    const oldDate = new Date("2020-01-01T00:00:00Z").toISOString();
    const rows = [createMockRow({ severity: "error", created_at: oldDate })];
    const series = calculateTimeSeries(rows, "7d");
    expect(series.length).toBe(1);
    expect(series[0].error).toBe(1);
  });

  it("empty string em campos string", () => {
    const row = createMockRow({ operation: "", table_name: "", error_message: "" });
    const csv = generateCSVContent([row]);
    expect(csv).toBeTruthy();
  });

  it("generateCSVContent com erro contendo newlines", () => {
    const rows = [createMockRow({ error_message: "line1\nline2\nline3" })];
    const csv = generateCSVContent(rows);
    expect(csv).toContain("line1");
  });

  it("multiple timeFilters produzem resultados consistentes", () => {
    const rows = createTimeDistributedRows(12, 5, "slow");
    for (const tf of ["1h", "6h", "24h", "7d"]) {
      const series = calculateTimeSeries(rows, tf);
      const total = series.reduce((s, b) => s + b.slow, 0);
      expect(total).toBe(60);
    }
  });
});

// ============================================================
// 14. Integração entre funções
// ============================================================
describe("Integração entre funções", () => {
  it("classifySeverity + buildTelemetryLogLine consistentes", () => {
    const testCases = [
      { ms: 200, error: false, expectedIcon: "✅" },
      { ms: 3500, error: false, expectedIcon: "🟡" },
      { ms: 9000, error: false, expectedIcon: "🔴" },
      { ms: 100, error: true, expectedIcon: "❌" },
    ];
    for (const tc of testCases) {
      const status = classifySeverity(tc.ms, tc.error);
      const line = buildTelemetryLogLine({
        operation: "select", table: "test", durationMs: tc.ms, status,
      });
      expect(line).toContain(tc.expectedIcon);
    }
  });

  it("calculateStats + calculateSeverityDistribution contagens batem", () => {
    const rows = createMixedSeverityRows({ slow: 10, very_slow: 5, error: 3 });
    const stats = calculateStats(rows);
    const dist = calculateSeverityDistribution(rows);
    const distMap = Object.fromEntries(dist.map(d => [d.name, d.value]));
    expect(stats.slow).toBe(distMap.slow);
    expect(stats.verySlow).toBe(distMap.very_slow);
    expect(stats.errors).toBe(distMap.error);
  });

  it("calculateTopOffenders + calculateTableAlerts retornam mesma ordem", () => {
    const rows = [
      ...createBulkRows(20, () => ({ table_name: "alpha" })),
      ...createBulkRows(10, () => ({ table_name: "beta" })),
      ...createBulkRows(5, () => ({ table_name: "gamma" })),
    ];
    const offenders = calculateTopOffenders(rows).map(o => o[0]);
    const alerts = calculateTableAlerts(rows).map(a => a.name);
    expect(offenders).toEqual(alerts);
  });

  it("generateCSVContent preserva contagem total de registros", () => {
    const rows = createBulkRows(42);
    const csv = generateCSVContent(rows);
    const lines = csv.split("\n");
    expect(lines.length - 1).toBe(42); // minus header
  });

  it("durationBuckets e timeSeries usam mesmos buckets para mesmo timeFilter", () => {
    const rows = createTimeDistributedRows(6, 3, "slow");
    const ts = calculateTimeSeries(rows, "24h");
    const db = calculateDurationBuckets(rows, "24h");
    expect(ts.length).toBe(db.length);
    for (let i = 0; i < ts.length; i++) {
      expect(ts[i].ts).toBe(db[i].ts);
    }
  });
});
