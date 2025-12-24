/**
 * @file AccordionItem.tsx
 * @description Item individual do accordion
 * @category Components/Accordion
 */

import React, { memo } from 'react';
import { AccordionItem as ShadcnAccordionItem } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

/**
 * Props do AccordionItem
 */
export interface AccordionItemProps {
  /** Valor único do item */
  value: string;
  /** Conteúdo do item (trigger + content) */
  children: React.ReactNode;
  /** Classe adicional */
  className?: string;
  /** Desabilitar item */
  disabled?: boolean;
  /** Variante de borda */
  variant?: 'default' | 'bordered' | 'separated';
}

const variantClasses = {
  default: 'border-b',
  bordered: 'border rounded-lg mb-2',
  separated: 'border-b-0 mb-4 pb-4 border-b last:border-b-0 last:mb-0 last:pb-0',
};

/**
 * Item individual do accordion
 * 
 * @example
 * ```tsx
 * <AccordionItem value="faq-1" variant="bordered">
 *   <AccordionTrigger>Pergunta 1</AccordionTrigger>
 *   <AccordionContent>Resposta 1</AccordionContent>
 * </AccordionItem>
 * ```
 */
export const AccordionItem = memo(function AccordionItem({
  value,
  children,
  className,
  disabled = false,
  variant = 'default',
}: AccordionItemProps) {
  return (
    <ShadcnAccordionItem
      value={value}
      disabled={disabled}
      className={cn(
        variantClasses[variant],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </ShadcnAccordionItem>
  );
});

AccordionItem.displayName = 'AccordionItem';

export default AccordionItem;
