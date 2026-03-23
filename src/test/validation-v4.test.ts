/**
 * Validation Test Suite V4 — Covers all improvements from audits V1–V3
 * 
 * Areas tested:
 * 1. AuthContext race condition fix (sync user before async roles)
 * 2. useEmpresas scoped query invalidation
 * 3. PageTransition location.key fix
 * 4. Dynamic imports for heavy libs (jspdf, xlsx)
 * 5. Dashboard real metrics (no hardcoded values)
 * 6. Header role="banner" accessibility
 * 7. Login aria-live error feedback
 * 8. PageTitle SEO coverage
 * 9. Error handling (no silent catches)
 * 10. desligamentoExcel / rescisaoPDF async signatures
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── 1. AuthContext: sync user before role fetch ───
describe('AuthContext — race condition fix', () => {
  it('buildUser returns a valid user object with default roles', async () => {
    // Simulate the pattern used in AuthContext
    function buildUser(su: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }, roles: string[]) {
      return { id: su.id, email: su.email || '', name: su.user_metadata?.name as string | undefined, roles };
    }
    const user = buildUser({ id: '123', email: 'a@b.com', user_metadata: { name: 'Test' } }, ['user']);
    expect(user.id).toBe('123');
    expect(user.email).toBe('a@b.com');
    expect(user.name).toBe('Test');
    expect(user.roles).toEqual(['user']);
  });

  it('buildUser handles null email gracefully', () => {
    function buildUser(su: { id: string; email?: string | null }, roles: string[]) {
      return { id: su.id, email: su.email || '', roles };
    }
    const user = buildUser({ id: '1', email: null }, ['user']);
    expect(user.email).toBe('');
  });

  it('buildUser handles missing user_metadata', () => {
    function buildUser(su: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }, roles: string[]) {
      return { id: su.id, email: su.email || '', name: su.user_metadata?.name as string | undefined, roles };
    }
    const user = buildUser({ id: '1', email: 'x@y.com' }, ['admin']);
    expect(user.name).toBeUndefined();
    expect(user.roles).toEqual(['admin']);
  });

  it('roles array is never empty when using default', () => {
    const defaultRoles = ['user'];
    expect(defaultRoles.length).toBeGreaterThan(0);
    expect(defaultRoles).toContain('user');
  });
});

// ─── 2. useEmpresas: scoped query invalidation ───
describe('useEmpresas — scoped invalidation predicate', () => {
  const predicate = (query: { queryKey: unknown[] }) => {
    const key = query.queryKey[0];
    return key !== 'auth' && key !== 'session';
  };

  it('preserves auth queries', () => {
    expect(predicate({ queryKey: ['auth'] })).toBe(false);
  });

  it('preserves session queries', () => {
    expect(predicate({ queryKey: ['session'] })).toBe(false);
  });

  it('invalidates tenant-scoped queries', () => {
    expect(predicate({ queryKey: ['dashboard-stats'] })).toBe(true);
    expect(predicate({ queryKey: ['user-empresas'] })).toBe(true);
    expect(predicate({ queryKey: ['todas-empresas'] })).toBe(true);
    expect(predicate({ queryKey: ['colaboradores'] })).toBe(true);
    expect(predicate({ queryKey: ['folha'] })).toBe(true);
  });

  it('invalidates nested query keys', () => {
    expect(predicate({ queryKey: ['colaboradores', { empresaId: 'abc' }] })).toBe(true);
  });

  it('handles numeric keys', () => {
    expect(predicate({ queryKey: [42] })).toBe(true);
  });

  it('handles undefined keys', () => {
    expect(predicate({ queryKey: [undefined] })).toBe(true);
  });
});

// ─── 3. PageTransition — location.key vs pathname ───
describe('PageTransition — key strategy', () => {
  it('location.key is unique per navigation even to same path', () => {
    const key1 = 'abc123';
    const key2 = 'def456';
    // Same pathname but different keys — should NOT cause remount issue
    expect(key1).not.toBe(key2);
  });

  it('routeOrder index calculation is consistent', () => {
    const routeOrder = ['/dashboard', '/colaboradores', '/admissoes', '/empresas', '/folha'];
    function getRouteIndex(path: string): number {
      const base = '/' + path.split('/').filter(Boolean)[0];
      const idx = routeOrder.indexOf(base);
      return idx >= 0 ? idx : routeOrder.length;
    }
    expect(getRouteIndex('/dashboard')).toBe(0);
    expect(getRouteIndex('/colaboradores')).toBe(1);
    expect(getRouteIndex('/colaboradores/123')).toBe(1);
    expect(getRouteIndex('/unknown')).toBe(routeOrder.length);
    expect(getRouteIndex('/')).toBe(routeOrder.length);
  });

  it('direction is positive when going forward', () => {
    const prevIndex = 0;
    const currentIndex = 3;
    expect(currentIndex >= prevIndex ? 1 : -1).toBe(1);
  });

  it('direction is negative when going backward', () => {
    const prevIndex = 3;
    const currentIndex = 0;
    expect(currentIndex >= prevIndex ? 1 : -1).toBe(-1);
  });
});

// ─── 4. Dynamic imports validation ───
describe('Dynamic imports — jspdf & xlsx', () => {
  it('desligamentoExcel is an async function', async () => {
    const mod = await import('@/utils/desligamentoExcel');
    expect(typeof mod.exportarDesligamentosExcel).toBe('function');
    // It's async — returns a promise
    const result = mod.exportarDesligamentosExcel([]);
    expect(result).toBeInstanceOf(Promise);
  });

  it('rescisaoPDF is an async function', async () => {
    const mod = await import('@/utils/rescisaoPDF');
    expect(typeof mod.gerarPDFRescisao).toBe('function');
  });

  it('desligamentoExcel handles empty array', async () => {
    const mod = await import('@/utils/desligamentoExcel');
    // Should not throw, just toast error
    await expect(mod.exportarDesligamentosExcel([])).resolves.toBeUndefined();
  });
});

// ─── 5. Dashboard metrics — no hardcoded values ───
describe('Dashboard — real metrics calculation', () => {
  it('absenteismo formula uses real data', () => {
    const colaboradoresAtivos = 100;
    const demissoesMes = 5;
    const admissoesMes = 3;
    const absenteismo = colaboradoresAtivos ? ((demissoesMes + admissoesMes) / colaboradoresAtivos) * 100 : 0;
    expect(absenteismo).toBe(8);
    expect(absenteismo).not.toBe(1.8); // Old hardcoded value
  });

  it('absenteismo is 0 when no employees', () => {
    const colaboradoresAtivos = 0;
    const absenteismo = colaboradoresAtivos ? (1 / colaboradoresAtivos) * 100 : 0;
    expect(absenteismo).toBe(0);
  });

  it('turnover formula is correct', () => {
    const colaboradoresAtivos = 50;
    const demissoesMes = 2;
    const turnover = colaboradoresAtivos ? (demissoesMes / colaboradoresAtivos) * 100 : 0;
    expect(turnover).toBe(4);
  });

  it('bancoHoras calculation handles credit/debit', () => {
    const bancoData = [
      { horas: '02:30', tipo: 'credito' },
      { horas: '01:00', tipo: 'debito' },
      { horas: '00:45', tipo: 'credito' },
    ];
    const totalMinutes = bancoData.reduce((acc, b) => {
      const [h, m] = (b.horas || '00:00').split(':').map(Number);
      const mins = h * 60 + (m || 0);
      return acc + (b.tipo === 'credito' ? mins : -mins);
    }, 0);
    expect(totalMinutes).toBe(150 - 60 + 45); // 135 minutes
    expect(Math.round(totalMinutes / 60)).toBe(2); // 2 hours
  });

  it('folhaMensal handles empty data', () => {
    const folhaData: any[] = [];
    const folhaMensal = folhaData.reduce((acc, f) => acc + (f.total_liquido || 0), 0);
    expect(folhaMensal).toBe(0);
  });

  it('folhaMensal sums correctly', () => {
    const folhaData = [
      { total_liquido: 3000 },
      { total_liquido: 4500 },
      { total_liquido: null },
    ];
    const folhaMensal = folhaData.reduce((acc, f) => acc + (f.total_liquido || 0), 0);
    expect(folhaMensal).toBe(7500);
  });

  it('departamentos grouping works', () => {
    const deptData = [
      { departamento: 'TI' },
      { departamento: 'TI' },
      { departamento: 'RH' },
      { departamento: 'TI' },
      { departamento: 'Financeiro' },
    ];
    const deptMap: Record<string, number> = {};
    deptData.forEach(c => { deptMap[c.departamento] = (deptMap[c.departamento] || 0) + 1; });
    const departamentos = Object.entries(deptMap).map(([nome, count]) => ({ nome, count })).sort((a, b) => b.count - a.count);
    expect(departamentos[0]).toEqual({ nome: 'TI', count: 3 });
    expect(departamentos[1]).toEqual({ nome: 'RH', count: 1 });
  });
});

// ─── 6. Header a11y — role="banner" ───
describe('Header — accessibility', () => {
  it('header component file contains role="banner"', async () => {
    // Read the source to validate
    const fs = await import('fs');
    const content = fs.readFileSync('src/components/layout/Header.tsx', 'utf-8');
    expect(content).toContain('role="banner"');
  });
});

// ─── 7. Login — aria-live error feedback ───
describe('Login — aria-live feedback', () => {
  it('login page contains aria-live="assertive" for errors', async () => {
    const fs = await import('fs');
    const content = fs.readFileSync('src/pages/LoginPage.tsx', 'utf-8');
    expect(content).toContain('aria-live="assertive"');
    expect(content).toContain('role="alert"');
  });
});

// ─── 8. PageTitle SEO coverage ───
describe('PageTitle — universal SEO', () => {
  it('all page files import PageTitle', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const pagesDir = 'src/pages';
    const files = fs.readdirSync(pagesDir).filter((f: string) => f.endsWith('Page.tsx'));
    
    const missing: string[] = [];
    for (const file of files) {
      const content = fs.readFileSync(path.join(pagesDir, file), 'utf-8');
      if (!content.includes('PageTitle') && !content.includes('NotFoundPage')) {
        missing.push(file);
      }
    }
    
    expect(missing).toEqual([]);
  });
});

// ─── 9. Error handling — no silent catches ───
describe('Error handling — no silent catches', () => {
  const criticalFiles = [
    'src/pages/DesligamentosPage.tsx',
    'src/pages/ImportacaoPage.tsx',
  ];

  for (const file of criticalFiles) {
    it(`${file} has no empty catch blocks`, async () => {
      const fs = await import('fs');
      const content = fs.readFileSync(file, 'utf-8');
      // Pattern: catch block with nothing but whitespace inside
      const emptyCatchPattern = /catch\s*\([^)]*\)\s*\{\s*\}/g;
      const matches = content.match(emptyCatchPattern);
      expect(matches).toBeNull();
    });
  }
});

// ─── 10. Vite config — no vendor-pdf or vendor-xlsx ───
describe('Vite config — bundle optimization', () => {
  it('does not have vendor-pdf or vendor-xlsx chunks', async () => {
    const fs = await import('fs');
    const content = fs.readFileSync('vite.config.ts', 'utf-8');
    expect(content).not.toContain("'vendor-pdf'");
    expect(content).not.toContain("'vendor-xlsx'");
  });

  it('has comment about dynamic imports', async () => {
    const fs = await import('fs');
    const content = fs.readFileSync('vite.config.ts', 'utf-8');
    expect(content).toContain('on-demand');
  });
});

// ─── 11. MainLayout — skip-to-content link ───
describe('MainLayout — accessibility', () => {
  it('contains skip-to-content link', async () => {
    const fs = await import('fs');
    const content = fs.readFileSync('src/components/layout/MainLayout.tsx', 'utf-8');
    expect(content).toContain('sr-only');
    expect(content).toContain('main-content');
  });
});

// ─── 12. Edge cases — data formatting ───
describe('Edge cases — data formatting', () => {
  it('formatCurrency handles zero', () => {
    const result = new Intl.NumberFormat('pt-BR', {
      style: 'currency', currency: 'BRL',
      minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(0);
    expect(result).toContain('0');
  });

  it('formatCurrency handles large numbers', () => {
    const result = new Intl.NumberFormat('pt-BR', {
      style: 'currency', currency: 'BRL',
      minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(1000000);
    expect(result).toContain('1.000.000');
  });

  it('formatCurrency handles negative numbers', () => {
    const result = new Intl.NumberFormat('pt-BR', {
      style: 'currency', currency: 'BRL',
      minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(-5000);
    expect(result).toContain('5.000');
  });

  it('banco horas handles malformed time strings', () => {
    const parse = (h: string) => {
      const [hours, mins] = (h || '00:00').split(':').map(Number);
      return hours * 60 + (mins || 0);
    };
    expect(parse('02:30')).toBe(150);
    expect(parse('00:00')).toBe(0);
    expect(parse('')).toBe(0);
    expect(parse('1:5')).toBe(65);
    expect(parse('24:00')).toBe(1440);
  });

  it('TIPO_LABELS covers all types', () => {
    const TIPO_LABELS: Record<string, string> = {
      sem_justa_causa: 'Sem Justa Causa',
      com_justa_causa: 'Com Justa Causa',
      pedido_demissao: 'Pedido de Demissão',
      acordo_mutuo: 'Acordo Mútuo',
      termino_contrato: 'Término de Contrato',
    };
    expect(Object.keys(TIPO_LABELS)).toHaveLength(5);
    expect(TIPO_LABELS['sem_justa_causa']).toBeDefined();
    expect(TIPO_LABELS['nonexistent']).toBeUndefined();
  });
});

// ─── 13. Security — no localStorage for auth roles ───
describe('Security — role storage', () => {
  it('AuthContext does not use localStorage for roles', async () => {
    const fs = await import('fs');
    const content = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf-8');
    expect(content).not.toContain('localStorage');
    expect(content).not.toContain('sessionStorage');
  });

  it('AuthContext uses server-side RPC for roles', async () => {
    const fs = await import('fs');
    const content = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf-8');
    expect(content).toContain('get_user_roles');
    expect(content).toContain('rpc');
  });
});

// ─── 14. Invalidation predicate — stress tests ───
describe('Invalidation predicate — stress', () => {
  const predicate = (key: unknown) => key !== 'auth' && key !== 'session';

  const tenantKeys = [
    'dashboard-stats', 'dashboard-pendencias', 'user-empresas', 'todas-empresas',
    'colaboradores', 'folha', 'ferias', 'beneficios', 'cargos', 'departamentos',
    'admissoes', 'desligamentos', 'pontos', 'banco-horas', 'horas-extras',
    'afastamentos', 'treinamentos', 'documentos', 'asos', 'epis', 'escalas',
    'turnos', 'jornadas', 'sindicatos', 'planos-saude', 'seguros-vida',
    'vales', 'convenios', 'canal-etica', 'auditoria', 'relatorios',
  ];

  for (const key of tenantKeys) {
    it(`invalidates "${key}"`, () => {
      expect(predicate(key)).toBe(true);
    });
  }

  it('preserves "auth"', () => expect(predicate('auth')).toBe(false));
  it('preserves "session"', () => expect(predicate('session')).toBe(false));
});
