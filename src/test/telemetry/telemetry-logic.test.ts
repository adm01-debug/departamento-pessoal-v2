import { describe, it, expect } from "vitest";
import {
  createMockRow,
  createSlowRow,
  createVerySlowRow,
  createErrorRow,
  createBulkRows,
  createMixedSeverityRows,
  createTimeDistributedRows,
  formatDuration,
  calculateStats,
  calculateTopOffenders,
  calculateTimeSeries,
  calculateSeverityDistribution,
  getTimeThreshold,
  type MockTelemetryRow,
} from "./telemetry-helpers";

// ============================================================
// 1. formatDuration — Formatação de duração
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
    expect(formatDuration(1050)).toBe("1.1s"); // toFixed(1) rounds
    expect(formatDuration(1049)).toBe("1.0s");
    expect(formatDuration(2750)).toBe("2.8s");
    expect(formatDuration(9999)).toBe("10.0s");
  });
});

// ============================================================
// 2. calculateStats — Cálculo de estatísticas
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
    // (100 + 200 + 201) / 3 = 167
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
// 3. calculateTopOffenders — Tabelas mais problemáticas
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
    expect(top[1][0]).toBe("empresas");
    expect(top[1][1].count).toBe(1);
  });

  it("prioriza rpc_name sobre table_name", () => {
    const rows = [
      createMockRow({ rpc_name: "check_brute_force", table_name: "login_attempts" }),
    ];
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
    const top = calculateTopOffenders(rows);
    expect(top[0][1].totalMs).toBe(400);
  });

  it("calcula maxMs corretamente", () => {
    const rows = [
      createMockRow({ table_name: "t1", duration_ms: 100 }),
      createMockRow({ table_name: "t1", duration_ms: 9000 }),
      createMockRow({ table_name: "t1", duration_ms: 500 }),
    ];
    const top = calculateTopOffenders(rows);
    expect(top[0][1].maxMs).toBe(9000);
  });

  it("limita a 8 offenders", () => {
    const rows: MockTelemetryRow[] = [];
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15 - i; j++) {
        rows.push(createMockRow({ table_name: `table_${i}` }));
      }
    }
    const top = calculateTopOffenders(rows);
    expect(top.length).toBe(8);
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
    const names = top.map(t => t[0]);
    expect(names).toContain("fn_calc");
    expect(names).toContain("users");
    expect(top.find(t => t[0] === "fn_calc")![1].count).toBe(2);
  });
});

// ============================================================
// 4. calculateTimeSeries — Série temporal
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
    // Both should be in same 5-min bucket
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
    // Should have a bucket but all counts are 0
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
// 5. calculateSeverityDistribution — Distribuição
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
// 6. getTimeThreshold — Limiar temporal
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
    const expected = Date.now() - 60 * 60 * 1000;
    expect(Math.abs(threshold - expected)).toBeLessThan(1000);
  });

  it("6h é ~6 horas atrás", () => {
    const threshold = new Date(getTimeThreshold("6h")).getTime();
    const expected = Date.now() - 6 * 60 * 60 * 1000;
    expect(Math.abs(threshold - expected)).toBeLessThan(1000);
  });

  it("24h é ~24 horas atrás", () => {
    const threshold = new Date(getTimeThreshold("24h")).getTime();
    const expected = Date.now() - 24 * 60 * 60 * 1000;
    expect(Math.abs(threshold - expected)).toBeLessThan(1000);
  });

  it("7d é ~7 dias atrás", () => {
    const threshold = new Date(getTimeThreshold("7d")).getTime();
    const expected = Date.now() - 7 * 24 * 60 * 60 * 1000;
    expect(Math.abs(threshold - expected)).toBeLessThan(1000);
  });

  it("filtro desconhecido usa 24h como padrão", () => {
    const threshold = new Date(getTimeThreshold("unknown")).getTime();
    const expected = Date.now() - 24 * 60 * 60 * 1000;
    expect(Math.abs(threshold - expected)).toBeLessThan(1000);
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
// 7. Mock Data Factories — Validação dos builders
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
    // All should have valid dates
    for (const r of rows) {
      expect(new Date(r.created_at).getTime()).toBeLessThanOrEqual(Date.now());
    }
  });

  it("createBulkRows aceita factory function", () => {
    const rows = createBulkRows(50, (i) => ({ table_name: `t_${i}`, duration_ms: i * 10 }));
    expect(rows[0].table_name).toBe("t_0");
    expect(rows[0].duration_ms).toBe(0);
    expect(rows[49].table_name).toBe("t_49");
    expect(rows[49].duration_ms).toBe(490);
  });

  it("overrides funcionam corretamente", () => {
    const row = createMockRow({
      operation: "INSERT",
      table_name: "custom_table",
      duration_ms: 9999,
      severity: "very_slow",
      record_count: 42,
    });
    expect(row.operation).toBe("INSERT");
    expect(row.table_name).toBe("custom_table");
    expect(row.duration_ms).toBe(9999);
    expect(row.severity).toBe("very_slow");
    expect(row.record_count).toBe(42);
  });
});

// ============================================================
// 8. Cenários de stress e edge cases
// ============================================================
describe("Stress & Edge Cases", () => {
  it("processa 1000 rows sem erro em calculateStats", () => {
    const rows = createBulkRows(1000, (i) => ({ duration_ms: i }));
    const stats = calculateStats(rows);
    expect(stats.avgDuration).toBe(500); // avg of 0..999 = 499.5 → 500
  });

  it("processa 1000 rows sem erro em calculateTopOffenders", () => {
    const tables = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
    const rows = createBulkRows(1000, (i) => ({ table_name: tables[i % tables.length] }));
    const top = calculateTopOffenders(rows);
    expect(top.length).toBe(8); // limited to 8
    expect(top[0][1].count).toBe(100); // 1000/10
  });

  it("processa 1000 rows sem erro em calculateTimeSeries", () => {
    const rows = createTimeDistributedRows(24, 42, "slow");
    const series = calculateTimeSeries(rows, "24h");
    const totalSlow = series.reduce((s, b) => s + b.slow, 0);
    expect(totalSlow).toBe(24 * 42);
  });

  it("lida com rows todas no mesmo timestamp", () => {
    const ts = new Date().toISOString();
    const rows = createBulkRows(100, () => ({ created_at: ts, severity: "slow" }));
    const series = calculateTimeSeries(rows, "24h");
    expect(series.length).toBe(1);
    expect(series[0].slow).toBe(100);
  });

  it("lida com duration_ms = 0 em todas as rows", () => {
    const rows = createBulkRows(50, () => ({ duration_ms: 0 }));
    expect(calculateStats(rows).avgDuration).toBe(0);
    expect(formatDuration(0)).toBe("0ms");
  });

  it("lida com duration_ms muito alto", () => {
    const rows = [createMockRow({ duration_ms: Number.MAX_SAFE_INTEGER })];
    const stats = calculateStats(rows);
    expect(stats.avgDuration).toBe(Number.MAX_SAFE_INTEGER);
  });

  it("topOffenders com tabelas iguais acumula corretamente", () => {
    const rows = createBulkRows(200, () => ({
      table_name: "single_table",
      duration_ms: 100,
    }));
    const top = calculateTopOffenders(rows);
    expect(top.length).toBe(1);
    expect(top[0][0]).toBe("single_table");
    expect(top[0][1].count).toBe(200);
    expect(top[0][1].totalMs).toBe(20000);
    expect(top[0][1].maxMs).toBe(100);
  });

  it("severity distribution com 5 severidades diferentes", () => {
    const rows = [
      createMockRow({ severity: "normal" }),
      createMockRow({ severity: "slow" }),
      createMockRow({ severity: "very_slow" }),
      createMockRow({ severity: "error" }),
      createMockRow({ severity: "custom" }),
    ];
    const dist = calculateSeverityDistribution(rows);
    expect(dist.length).toBe(5);
  });
});

// ============================================================
// 9. Integração — Fluxo completo
// ============================================================
describe("Fluxo completo de processamento", () => {
  it("pipeline completo: rows → stats + top offenders + series + distribution", () => {
    const rows = [
      ...createBulkRows(30, () => ({ table_name: "colaboradores", severity: "slow", duration_ms: 4000 })),
      ...createBulkRows(10, () => ({ table_name: "empresas", severity: "very_slow", duration_ms: 12000 })),
      ...createBulkRows(5, () => ({ rpc_name: "check_brute_force", severity: "error", duration_ms: 0, error_message: "timeout" })),
      ...createBulkRows(55, () => ({ table_name: "registros_ponto", severity: "normal", duration_ms: 200 })),
    ];

    // Stats
    const stats = calculateStats(rows);
    expect(stats.slow).toBe(30);
    expect(stats.verySlow).toBe(10);
    expect(stats.errors).toBe(5);
    expect(stats.avgDuration).toBeGreaterThan(0);

    // Top offenders
    const top = calculateTopOffenders(rows);
    expect(top[0][0]).toBe("registros_ponto"); // 55 rows
    expect(top[1][0]).toBe("colaboradores");     // 30 rows
    expect(top[2][0]).toBe("empresas");           // 10 rows
    expect(top[3][0]).toBe("check_brute_force");  // 5 rows

    // Distribution
    const dist = calculateSeverityDistribution(rows);
    const map = Object.fromEntries(dist.map(d => [d.name, d.value]));
    expect(map.normal).toBe(55);
    expect(map.slow).toBe(30);
    expect(map.very_slow).toBe(10);
    expect(map.error).toBe(5);

    // Time series
    const series = calculateTimeSeries(rows, "24h");
    expect(series.length).toBeGreaterThanOrEqual(1);
  });

  it("formatação de durações no contexto de stats", () => {
    const rows = createMixedSeverityRows({ slow: 10, very_slow: 5 });
    const stats = calculateStats(rows);
    const formatted = formatDuration(stats.avgDuration);
    expect(formatted).toMatch(/^\d+(\.\d)?m?s$/);
  });
});

// ============================================================
// 10. Operações específicas
// ============================================================
describe("Operações e campos opcionais", () => {
  it("suporta diferentes operações", () => {
    const ops = ["SELECT", "INSERT", "UPDATE", "DELETE", "RPC", "SUBSCRIBE"];
    const rows = ops.map(op => createMockRow({ operation: op }));
    const stats = calculateStats(rows);
    expect(stats.avgDuration).toBeGreaterThan(0);
  });

  it("lida com campos null corretamente", () => {
    const row = createMockRow({
      table_name: null,
      rpc_name: null,
      record_count: null,
      query_limit: null,
      query_offset: null,
      count_mode: null,
      error_message: null,
      user_id: null,
    });
    // Should not throw when processed
    const top = calculateTopOffenders([row]);
    expect(top[0][0]).toBe("unknown");
  });

  it("lida com count_mode variados", () => {
    const modes = [null, "exact", "planned", "estimated"];
    const rows = modes.map(m => createMockRow({ count_mode: m }));
    expect(rows.length).toBe(4);
    expect(calculateStats(rows).avgDuration).toBeGreaterThan(0);
  });

  it("filtra por severity na simulação de query", () => {
    const rows = createMixedSeverityRows({ normal: 50, slow: 30, very_slow: 15, error: 5 });
    
    // Simulate severity filter
    const filterSlow = rows.filter(r => r.severity === "slow");
    expect(filterSlow.length).toBe(30);
    
    const filterVerySlow = rows.filter(r => r.severity === "very_slow");
    expect(filterVerySlow.length).toBe(15);
    
    const filterError = rows.filter(r => r.severity === "error");
    expect(filterError.length).toBe(5);
    
    // "all" = no filter
    expect(rows.length).toBe(100);
  });

  it("filtra por time threshold na simulação", () => {
    const now = Date.now();
    const rows = [
      createMockRow({ created_at: new Date(now).toISOString() }),
      createMockRow({ created_at: new Date(now - 30 * 60 * 1000).toISOString() }),
      createMockRow({ created_at: new Date(now - 2 * 60 * 60 * 1000).toISOString() }),
      createMockRow({ created_at: new Date(now - 25 * 60 * 60 * 1000).toISOString() }),
    ];

    const threshold1h = new Date(getTimeThreshold("1h")).getTime();
    const filtered1h = rows.filter(r => new Date(r.created_at).getTime() >= threshold1h);
    expect(filtered1h.length).toBe(2);

    const threshold24h = new Date(getTimeThreshold("24h")).getTime();
    const filtered24h = rows.filter(r => new Date(r.created_at).getTime() >= threshold24h);
    expect(filtered24h.length).toBe(3);
  });
});
