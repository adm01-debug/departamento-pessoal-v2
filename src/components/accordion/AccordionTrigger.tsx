/**
 * @file AccordionTrigger.tsx
 * @description Gatilho/cabeçalho clicável do accordion
 * @category Components/Accordion
 */

import React, { memo } from 'react';
import { AccordionTrigger as ShadcnAccordionTrigger } from '@/components/ui/accordion';
import { ChevronDown, ChevronRight, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props do AccordionTrigger
 */
export interface AccordionTriggerProps {
  /** Texto ou conteúdo do trigger */
  children: React.ReactNode;
  /** Classe adicional */
  className?: string;
  /** Ícone customizado à esquerda */
  icon?: React.ReactNode;
  /** Estilo do ícone de expansão */
  chevronStyle?: 'chevron' | 'plus' | 'arrow' | 'none';
  /** Posição do ícone de expansão */
  chevronPosition?: 'left' | 'right';
  /** Tamanho do texto */
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'py-2 text-sm',
  md: 'py-4 text-base',
  lg: 'py-6 text-lg',
};

/**
 * Gatilho clicável do accordion
 * 
 * @example
 * ```tsx
 * <AccordionTrigger chevronStyle="plus" size="lg">
 *   Como funciona?
 * </AccordionTrigger>
 * ```
 */
export const AccordionTrigger = memo(function AccordionTrigger({
  children,
  className,
  icon,
  chevronStyle = 'chevron',
  chevronPosition = 'right',
  size = 'md',
}: AccordionTriggerProps) {
  const renderChevron = () => {
    if (chevronStyle === 'none') return null;
    
    const iconClasses = cn(
      'h-4 w-4 shrink-0 transition-transform duration-200',
      chevronStyle === 'chevron' && 'group-data-[state=open]:rotate-180',
      chevronStyle === 'arrow' && 'group-data-[state=open]:rotate-90'
    );

    switch (chevronStyle) {
      case 'plus':
        return (
          <>
            <Plus className={cn(iconClasses, 'group-data-[state=open]:hidden')} />
            <Minus className={cn(iconClasses, 'hidden group-data-[state=open]:block')} />
          </>
        );
      case 'arrow':
        return <ChevronRight className={iconClasses} />;
      default:
        return <ChevronDown className={iconClasses} />;
    }
  };

  return (
    <ShadcnAccordionTrigger
      className={cn(
        'group flex flex-1 items-center justify-between font-medium',
        'hover:underline focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-ring focus-visible:ring-offset-2',
        sizeClasses[size],
        chevronPosition === 'left' && 'flex-row-reverse justify-end gap-2',
        '[&>svg]:transition-transform [&>svg]:duration-200',
        className
      )}
    >
      <div className="flex items-center gap-2">
        {icon}
        {children}
      </div>
      {renderChevron()}
    </ShadcnAccordionTrigger>
  );
});

AccordionTrigger.displayName = 'AccordionTrigger';

export default AccordionTrigger;
