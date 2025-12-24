/**
 * @file AccordionContainer.tsx
 * @description Container principal para grupo de accordions
 * @category Components/Accordion
 */

import React, { memo, createContext, useContext, useState, useCallback } from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

/**
 * Context para gerenciar estado do accordion
 */
interface AccordionContextValue {
  type: 'single' | 'multiple';
  value: string | string[];
  onValueChange: (value: string | string[]) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

export const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('useAccordionContext must be used within AccordionContainer');
  }
  return context;
};

/**
 * Props do AccordionContainer
 */
export interface AccordionContainerProps {
  /** Tipo de seleção */
  type?: 'single' | 'multiple';
  /** Valor(es) aberto(s) */
  value?: string | string[];
  /** Valor padrão */
  defaultValue?: string | string[];
  /** Callback de mudança */
  onValueChange?: (value: string | string[]) => void;
  /** Se permite fechar todos (single) */
  collapsible?: boolean;
  /** Classe adicional */
  className?: string;
  /** Elementos filhos */
  children: React.ReactNode;
  /** Desabilitar todos */
  disabled?: boolean;
  /** Orientação */
  orientation?: 'vertical' | 'horizontal';
}

/**
 * Container principal para accordions
 * 
 * @example
 * ```tsx
 * <AccordionContainer type="single" collapsible>
 *   <AccordionItem value="item-1">
 *     <AccordionTrigger>Seção 1</AccordionTrigger>
 *     <AccordionContent>Conteúdo 1</AccordionContent>
 *   </AccordionItem>
 * </AccordionContainer>
 * ```
 */
export const AccordionContainer = memo(function AccordionContainer({
  type = 'single',
  value,
  defaultValue,
  onValueChange,
  collapsible = false,
  className,
  children,
  disabled = false,
  orientation = 'vertical',
}: AccordionContainerProps) {
  const [internalValue, setInternalValue] = useState<string | string[]>(
    defaultValue ?? (type === 'multiple' ? [] : '')
  );

  const currentValue = value ?? internalValue;

  const handleValueChange = useCallback((newValue: string | string[]) => {
    if (disabled) return;
    setInternalValue(newValue);
    onValueChange?.(newValue);
  }, [disabled, onValueChange]);

  const contextValue: AccordionContextValue = {
    type,
    value: currentValue,
    onValueChange: handleValueChange,
  };

  const accordionProps = type === 'single'
    ? {
        type: 'single' as const,
        value: currentValue as string,
        onValueChange: handleValueChange as (value: string) => void,
        collapsible,
      }
    : {
        type: 'multiple' as const,
        value: currentValue as string[],
        onValueChange: handleValueChange as (value: string[]) => void,
      };

  return (
    <AccordionContext.Provider value={contextValue}>
      <Accordion
        {...accordionProps}
        disabled={disabled}
        orientation={orientation}
        className={cn(
          'w-full',
          orientation === 'horizontal' && 'flex flex-row',
          disabled && 'opacity-50 pointer-events-none',
          className
        )}
      >
        {children}
      </Accordion>
    </AccordionContext.Provider>
  );
});

AccordionContainer.displayName = 'AccordionContainer';

export default AccordionContainer;
