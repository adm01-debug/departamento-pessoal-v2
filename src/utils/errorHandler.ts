// @ts-nocheck
export interface AppError { message: string; code?: string; status?: number; details?: any; }
export function handleApiError(error: unknown): AppError {
  if (error instanceof Error) return { message: error.message };
  return { message: 'Erro desconhecido.' };
}
