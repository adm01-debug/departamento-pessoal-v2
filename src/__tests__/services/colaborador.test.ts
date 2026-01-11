// src/__tests__/services/colaborador.test.ts
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { server } from '@/mocks';
import { colaboradorService } from '@/services/colaboradorService';

describe('colaboradorService', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  
  it('lists colaboradores', async () => { 
    const result = await colaboradorService.list(); 
    expect(Array.isArray(result)).toBe(true); 
  });
});