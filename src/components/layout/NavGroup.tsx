/**
 * @module NavGroup
 * @description Grupo de navegação para sidebar
 * @category Layout
 */

import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

/**
 * Props do componente NavGroup
 */
interface NavGroupProps {
  /** Título do grupo */
  title: string;
  /** Ícone do grupo */
  icon?: React.ReactNode;
  /** Itens de navegação */
  children: React.ReactNode;
  /** Iniciar expandido */
  defaultOpen?: boolean;
  /** Collapsible */
  collapsible?: boolean;
  /** Badge de contagem */
  badge?: number | string;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * NavGroup - Grupo de navegação
 *
 * @description Agrupa itens de navegação com título
 * e comportamento colapsável opcional
 *
 * @example
 * ```tsx
 * <NavGroup title="Configurações" icon={<Settings />}>
 *   <NavItem href="/config/geral">Geral</NavItem>
 *   <NavItem href="/config/usuarios">Usuários</NavItem>
 * </NavGroup>
 * ```
 */
export const NavGroup = React.memo(function NavGroup({
  title,
  icon,
  children,
  defaultOpen = true,
  collapsible = true,
  badge,
  className,
}: NavGroupProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  if (!collapsible) {
    return (
      <div className={cn("space-y-1", className)}>
        <div className="flex items-center gap-2 px-3 py-2">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </span>
          {badge !== undefined && (
            <span className="ml-auto text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <div className="space-y-1">{children}</div>
      </div>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={className}>
      <CollapsibleTrigger className="flex w-full items-center gap-2 px-3 py-2 hover:bg-muted/50 rounded-md">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <span className="text-sm font-medium flex-1 text-left">{title}</span>
        {badge !== undefined && (
          <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
            {badge}
          </span>
        )}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 pl-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
});

NavGroup.displayName = "NavGroup";

export default NavGroup;
export type { NavGroupProps };
