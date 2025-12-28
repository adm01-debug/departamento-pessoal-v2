import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface AccessibleAccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  description?: string;
  error?: string;
}

/**
 * Accordion Acessível
 * Componente acessível seguindo WCAG 2.2 AA
 */
export const AccessibleAccordion = forwardRef<HTMLDivElement, AccessibleAccordionProps>(
  ({ className, label, description, error, children, ...props }, ref) => {
    const id = React.useId();
    
    return (
      <div
        ref={ref}
        className={cn('accessible-component', className)}
        role="group"
        aria-labelledby={label ? `${id}-label` : undefined}
        aria-describedby={description ? `${id}-desc` : undefined}
        aria-invalid={!!error}
        aria-errormessage={error ? `${id}-error` : undefined}
        {...props}
      >
        {label && <label id={`${id}-label`} className="sr-only">{label}</label>}
        {description && <p id={`${id}-desc`} className="sr-only">{description}</p>}
        {children}
        {error && <p id={`${id}-error`} role="alert" className="text-destructive text-sm">{error}</p>}
      </div>
    );
  }
);

AccessibleAccordion.displayName = 'AccessibleAccordion';
export default AccessibleAccordion;
