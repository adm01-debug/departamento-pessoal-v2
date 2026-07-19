const MIN_LENGTH = 8;
const MAX_LENGTH = 128;

export interface PasswordValidation {
  valid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];

  if (password.length < MIN_LENGTH) {
    errors.push(`Mínimo de ${MIN_LENGTH} caracteres`);
  }
  if (password.length > MAX_LENGTH) {
    errors.push(`Máximo de ${MAX_LENGTH} caracteres`);
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Pelo menos 1 letra maiúscula');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Pelo menos 1 letra minúscula');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Pelo menos 1 número');
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Pelo menos 1 caractere especial');
  }

  return { valid: errors.length === 0, errors };
}
