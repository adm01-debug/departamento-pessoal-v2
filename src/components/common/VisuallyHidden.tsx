/**
 * @fileoverview Componente para texto visualmente oculto (leitores de tela)
 * @module components/common/VisuallyHidden
 */
import { memo, type ReactNode } from 'react';

/** Props do VisuallyHidden */
interface VisuallyHiddenProps {
  /** Conteúdo para leitores de tela */
  children: ReactNode;
  /** Tag HTML a usar */
  as?: 'span' | 'div' | 'p' | 'label';
}

/**
 * Componente que oculta conteúdo visualmente mas mantém acessível
 * para leitores de tela
 * @example
 * ```tsx
 * <button>
 *   <Icon />
 *   <VisuallyHidden>Fechar modal</VisuallyHidden>
 * </button>
 * ```
 */
export const VisuallyHidden = memo(function VisuallyHidden({
  children,
  as: Component = 'span',
}: VisuallyHiddenProps) {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  );
});
