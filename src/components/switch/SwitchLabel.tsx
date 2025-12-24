/**
 * @fileoverview Label para switch
 * @module components/switch/SwitchLabel
 */
import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

/** Props do SwitchLabel */
interface SwitchLabelProps {
  /** Texto ou conteúdo do label */
  children: ReactNode;
  /** ID do switch associado */
  htmlFor?: string;
  /** Descrição adicional */
  description?: string;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Label para componentes switch
 * @param props - Propriedades do componente
 * @returns Elemento JSX
 */
export const SwitchLabel = memo(function SwitchLabel({
  children,
  htmlFor,
  description,
  className,
}: SwitchLabelProps) {
  return (
    <div className={cn('space-y-0.5', className)}>
      <Label
        htmlFor={htmlFor}
        className="text-sm font-medium cursor-pointer"
      >
        {children}
      </Label>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
});
