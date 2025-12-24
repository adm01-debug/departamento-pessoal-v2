/**
 * @module TabList
 * @description Lista de triggers para tabs
 * @category Tabs
 */

import React from "react";
import { TabsList } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

/**
 * Props do componente TabList
 */
interface TabListProps {
  /** Triggers das tabs */
  children: React.ReactNode;
  /** Estilo da lista */
  variant?: "default" | "outline" | "pills";
  /** Ocupar largura total */
  fullWidth?: boolean;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Mapeamento de variantes
 */
const variantClasses: Record<string, string> = {
  default: "bg-muted p-1 rounded-lg",
  outline: "border-b border-border bg-transparent p-0 rounded-none",
  pills: "bg-transparent p-0 gap-2",
};

/**
 * TabList - Lista de tabs
 *
 * @description Container para os triggers/botões das tabs
 * com diferentes estilos visuais
 *
 * @example
 * ```tsx
 * <TabList>
 *   <TabItem value="tab1">Tab 1</TabItem>
 *   <TabItem value="tab2">Tab 2</TabItem>
 * </TabList>
 * <TabList variant="pills" fullWidth>
 *   <TabItem value="a">A</TabItem>
 *   <TabItem value="b">B</TabItem>
 * </TabList>
 * ```
 */
export const TabList = React.memo(function TabList({
  children,
  variant = "default",
  fullWidth = false,
  className,
}: TabListProps) {
  return (
    <TabsList
      className={cn(
        "inline-flex h-auto items-center justify-start",
        variantClasses[variant],
        fullWidth && "w-full",
        className
      )}
    >
      {children}
    </TabsList>
  );
});

TabList.displayName = "TabList";

export default TabList;
export type { TabListProps };
