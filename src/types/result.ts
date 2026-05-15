import { ErrorDetails } from '@/errors/types';

export type Result<T, E = ErrorDetails> = 
  | { ok: true; value: T }
  | { ok: false; error: E };

export const Ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const Err = <E>(error: E): Result<never, E> => ({ ok: false, error });

export const toResult = async <T>(promise: Promise<T>): Promise<Result<T>> => {
  try {
    const value = await promise;
    return Ok(value);
  } catch (e: any) {
    return Err({
      type: 'SERVER_ERROR',
      severity: 'error',
      message: e.message || 'Erro inesperado',
      timestamp: new Date(),
    });
  }
};
