/**
 * @module Section
 * @description Seção de conteúdo com título
 * @category Layout
 */

import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

/**
 * Props do componente Section
 */
interface SectionProps {
  /** Conteúdo da seção */
  children: React.ReactNode;
  /** Título da seção */
  title?: string;
  /** Descrição/subtítulo */
  description?: string;
  /** Ícone do título */
  icon?: React.ReactNode;
  /** Ações do header */
  actions?: React.ReactNode;
  /** Usar card como container */
  asCard?: boolean;
  /** Padding interno */
  padding?: "none" | "sm" | "md" | "lg";
  /** Borda */
  bordered?: boolean;
  /** ID para ancoragem */
  id?: string;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Mapeamento de paddings
 */
const paddingClasses: Record<string, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

/**
 * Section - Seção de conteúdo
 *
 * @description Agrupa conteúdo em seções lógicas
 * com título e descrição opcionais
 *
 * @example
 * ```tsx
 * <Section title="Informações Pessoais" description="Dados básicos do funcionário">
 *   <FormFields />
 * </Section>
 * <Section title="Relatórios" asCard actions={<FilterButton />}>
 *   <ReportsTable />
 * </Section>
 * ```
 */
export const Section = React.memo(function Section({
  children,
  title,
  description,
  icon,
  actions,
  asCard = false,
  padding = "md",
  bordered = false,
  id,
  className,
}: SectionProps) {
  const hasHeader = title || description || actions;

  if (asCard) {
    return (
      <Card id={id} className={className}>
        {hasHeader && (
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-2">
              {icon && <span className="text-muted-foreground">{icon}</span>}
              <div>
                {title && <CardTitle>{title}</CardTitle>}
                {description && <CardDescription>{description}</CardDescription>}
              </div>
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </CardHeader>
        )}
        <CardContent className={!hasHeader ? paddingClasses[padding] : undefined}>
          {children}
        </CardContent>
      </Card>
    );
  }

  return (
    <section
      id={id}
      className={cn(
        paddingClasses[padding],
        bordered && "border rounded-lg",
        className
      )}
    >
      {hasHeader && (
        <div className="flex flex-col gap-1 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {icon && <span className="text-muted-foreground">{icon}</span>}
            <div>
              {title && (
                <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
              )}
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2 mt-2 sm:mt-0">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
});

Section.displayName = "Section";

export default Section;
export type { SectionProps };
