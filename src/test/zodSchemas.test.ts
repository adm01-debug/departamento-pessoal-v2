import { describe, it, expect } from 'vitest';
import * as zodSchemas from '@/lib/zodSchemas';

describe('zodSchemas', () => {
  it('deve estar definido', () => { expect(zodSchemas).toBeDefined(); });
  it('deve exportar schemas Zod', () => { 
    const keys = Object.keys(zodSchemas);
    expect(keys.length).toBeGreaterThan(0);
  });
  it('schemas devem ter método parse', () => { 
    const firstSchema = Object.values(zodSchemas)[0];
    if (firstSchema && typeof firstSchema === 'object') {
      expect(firstSchema.parse || firstSchema.safeParse).toBeDefined();
    }
  });
});
