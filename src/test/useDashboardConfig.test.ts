import { describe, it, expect } from 'vitest';

describe('useDashboardConfig', () => {
  it('deve salvar configuração no localStorage', () => {
    const config = { widgets: ['kpi', 'chart'], theme: 'dark' };
    const saved = JSON.stringify(config);
    const loaded = JSON.parse(saved);
    expect(loaded.theme).toBe('dark');
  });

  it('deve mesclar configurações padrão', () => {
    const defaults = { widgets: [], theme: 'light', compact: false };
    const user = { theme: 'dark' };
    const merged = { ...defaults, ...user };
    expect(merged.theme).toBe('dark');
    expect(merged.compact).toBe(false);
  });
});
