/**
 * @file AccordionContent.tsx
 * @description Conteúdo expansível do accordion
 * @category Components/Accordion
 */

import React, { memo } from 'react';
import { AccordionContent as ShadcnAccordionContent } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

/**
 * Props do AccordionContent
 */
export interface AccordionContentProps {
  /** Conteúdo do accordion */
  children: React.ReactNode;
  /** Classe adicional */
  className?: string;
  /** Forçar montagem mesmo quando fechado */
  forceMount?: boolean;
  /** Padding interno */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Cor de fundo */
  variant?: 'default' | 'muted' | 'card';
}

const paddingClasses = {
  none: 'p-0',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
};

const variantClasses = {
  default: '',
  muted: 'bg-muted/50',
  card: 'bg-card',
};

/**
 * Conteúdo expansível do accordion
 * 
 * @example
 * ```tsx
 * <AccordionContent padding="md">
 *   <p>Conteúdo detalhado aqui...</p>
 * </AccordionContent>
 * ```
 */
export const AccordionContent = memo(function AccordionContent({
  children,
  className,
  forceMount,
  padding = 'md',
  variant = 'default',
}: AccordionContentProps) {
  const resolvedForceMount = forceMount ? true : undefined;

  return (
    <ShadcnAccordionContent
      forceMount={resolvedForceMount}
      className={cn(
        'overflow-hidden',
        'data-[state=closed]:animate-accordion-up',
        'data-[state=open]:animate-accordion-down',
        className
      )}
    >
      <div
        className={cn(
          paddingClasses[padding],
          variantClasses[variant],
          'text-sm'
        )}
      >
        {children}
      </div>
    </ShadcnAccordionContent>
  );
});

AccordionContent.displayName = 'AccordionContent';

export default AccordionContent;
