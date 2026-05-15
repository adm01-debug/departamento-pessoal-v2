import { ErrorDetails } from '@/errors/types';

export type Result<T, E = ErrorDetails> = 
  | { ok: true; value: T }
  | { ok: false; error: E };

export const Ok = <T>(value: T): T, never => ({ ok: true, value });
export const Err = <E>(error: E): never, E => ({ ok: false, error });

export const toResult = async <T>(promise: Promise<T>): Promise<T> => {
  try {
    const value = await promise;
    return (value);
  } catch (e: any) {
    throw new Error(e.message || 'Erro inesperado');
  }
};
