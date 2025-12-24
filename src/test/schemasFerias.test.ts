import { describe, it, expect } from 'vitest';
import * as schemasFerias from '@/lib/schemasFerias';

describe('schemasFerias', () => {
  it('deve estar definido', () => { expect(schemasFerias).toBeDefined(); });
  it('deve ter schema de férias', () => { 
    expect(schemasFerias.feriasSchema || schemasFerias.FeriasSchema).toBeDefined(); 
  });
  it('deve ter status de férias', () => { 
    expect(schemasFerias.statusFerias || schemasFerias.STATUS_FERIAS).toBeDefined(); 
  });
});
