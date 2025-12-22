import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Logger', () => {
  const originalEnv = import.meta.env;
  
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deve logar em desenvolvimento', async () => {
    const { logger } = await import('../lib/logger');
    logger.log('teste');
    // Em dev, deve chamar console.log
  });

  it('deve logar erros com contexto', async () => {
    const { logger } = await import('../lib/logger');
    const error = new Error('Erro de teste');
    logger.error('Mensagem', error);
  });
});
