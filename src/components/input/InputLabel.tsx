/**
 * @fileoverview Label para inputs
 * @module components/input/InputLabel
 */
import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

/** Props do InputLabel */
interface InputLabelProps {
  /** Texto ou conteúdo do label */
  children: ReactNode;
  /** ID do input associado */
  htmlFor?: string;
  /** Se o campo é obrigatório */
  required?: boolean;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Label para campos de formulário
 * @param props - Propriedades do componente
 * @returns Elemento JSX
 */
export const InputLabel = memo(function InputLabel({
  children,
  htmlFor,
  required = false,
  className,
}: InputLabelProps) {
  return (
    <Label
      htmlFor={htmlFor}
      className={cn('text-sm font-medium', className)}
    >
      {children}
      {required && <span className="ml-1 text-destructive">*</span>}
    </Label>
  );
});
