/**
 * @fileoverview Link para pular navegação (acessibilidade)
 * @module components/common/SkipLink
 */
import { memo } from 'react';
import { cn } from '@/lib/utils';

/** Props do SkipLink */
interface SkipLinkProps {
  /** ID do elemento de destino */
  targetId?: string;
  /** Texto do link */
  children?: string;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Link para pular para conteúdo principal
 * Visível apenas com foco do teclado
 */
export const SkipLink = memo(function SkipLink({
  targetId = 'main-content',
  children = 'Pular para conteúdo principal',
  className,
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        'sr-only focus:not-sr-only',
        'focus:absolute focus:top-4 focus:left-4 focus:z-50',
        'focus:bg-primary focus:text-primary-foreground',
        'focus:px-4 focus:py-2 focus:rounded-md',
        'focus:outline-none focus:ring-2 focus:ring-ring',
        className
      )}
    >
      {children}
    </a>
  );
});
