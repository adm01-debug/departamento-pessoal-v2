// V17.2-U013: Utilitários de Erro
export class AppError extends Error { constructor(message: string, public code: string, public statusCode: number = 400) { super(message); this.name = 'AppError'; } }
export class ValidationError extends AppError { constructor(message: string, public field?: string) { super(message, 'VALIDATION_ERROR', 400); this.name = 'ValidationError'; } }
export class NotFoundError extends AppError { constructor(resource: string) { super(`${resource} não encontrado(a)`, 'NOT_FOUND', 404); this.name = 'NotFoundError'; } }
export class UnauthorizedError extends AppError { constructor(message: string = 'Não autorizado') { super(message, 'UNAUTHORIZED', 401); this.name = 'UnauthorizedError'; } }
export class ForbiddenError extends AppError { constructor(message: string = 'Acesso negado') { super(message, 'FORBIDDEN', 403); this.name = 'ForbiddenError'; } }
export function handleError(error: unknown): { message: string; code: string } { if (error instanceof AppError) return { message: error.message, code: error.code }; if (error instanceof Error) return { message: error.message, code: 'UNKNOWN_ERROR' }; return { message: 'Erro desconhecido', code: 'UNKNOWN_ERROR' }; }
