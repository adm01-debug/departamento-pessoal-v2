/**
 * @fileoverview Texto de ajuda para inputs
 * @module components/input/InputHelperText
 */
import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Props do InputHelperText */
interface InputHelperTextProps {
  /** Texto ou conteúdo de ajuda */
  children: ReactNode;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Texto de ajuda abaixo de campos de formulário
 * @param props - Propriedades do componente
 * @returns Elemento JSX
 */
export const InputHelperText = memo(function InputHelperText({
  children,
  className,
}: InputHelperTextProps) {
  return (
    <p
      className={cn(
        'text-sm text-muted-foreground',
        className
      )}
    >
      {children}
    </p>
  );
});
