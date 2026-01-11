// V15-370
import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest';
import { server } from '@/test/mocks/server';
import { colaboradorService } from '@/services/colaboradorService';
describe('colaboradorService', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  it('lists colaboradores', async () => { const result = await colaboradorService.list(); expect(Array.isArray(result)).toBe(true); });
});
