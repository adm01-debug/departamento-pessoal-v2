// V19-014: API Error Handler Centralizado
export class APIError extends Error {
  constructor(public status: number, message: string, public code?: string, public details?: unknown) {
    super(message);
    this.name = 'APIError';
  }
}

export const handleAPIError = (error: unknown): APIError => {
  if (error instanceof APIError) return error;
  if (error instanceof Error) return new APIError(500, error.message);
  return new APIError(500, 'Erro desconhecido');
};

export const apiErrorMessages: Record<number, string> = {
  400: 'Requisição inválida',
  401: 'Não autorizado',
  403: 'Acesso negado',
  404: 'Não encontrado',
  409: 'Conflito de dados',
  422: 'Dados inválidos',
  429: 'Muitas requisições',
  500: 'Erro interno do servidor',
  502: 'Serviço indisponível',
  503: 'Serviço temporariamente indisponível',
};

export const getErrorMessage = (status: number): string => apiErrorMessages[status] || 'Erro desconhecido';

export const isRetryableError = (status: number): boolean => [408, 429, 500, 502, 503, 504].includes(status);

export const withRetry = async <T>(fn: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try { return await fn(); }
    catch (e) {
      if (i === maxRetries - 1 || (e instanceof APIError && !isRetryableError(e.status))) throw e;
      await new Promise(r => setTimeout(r, delay * Math.pow(2, i)));
    }
  }
  throw new Error('Max retries exceeded');
};
