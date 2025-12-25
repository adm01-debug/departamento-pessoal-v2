import type { FieldError } from 'react-hook-form';
/** Campo de formulário */
export interface FormField<T = string> {
  value: T;
  error?: FieldError;
  touched?: boolean;
}
/** Estado de submit */
export interface SubmitState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  submitCount: number;
}
/** Props base de modal de formulário */
export interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}
