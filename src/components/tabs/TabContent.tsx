/**
 * @module TabContent
 * @description Container de conteúdo para tabs
 * @category Tabs
 */

import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

/**
 * Props do componente TabContent
 */
interface TabContentProps {
  /** Valor/ID da tab correspondente */
  value: string;
  /** Conteúdo da tab */
  children: React.ReactNode;
  /** Forçar montagem mesmo quando inativo */
  forceMount?: boolean;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * TabContent - Conteúdo de uma tab
 *
 * @description Wrapper para o conteúdo exibido quando
 * uma tab específica está ativa
 *
 * @example
 * ```tsx
 * <TabContent value="geral">
 *   <p>Conteúdo da aba geral</p>
 * </TabContent>
 * <TabContent value="detalhes" forceMount>
 *   <p>Conteúdo sempre montado</p>
 * </TabContent>
 * ```
 */
export const TabContent = React.memo(function TabContent({
  value,
  children,
  forceMount,
  className,
}: TabContentProps) {
  return (
    <TabsContent
      value={value}
      forceMount={forceMount || undefined}
      className={cn(
        "mt-4 ring-offset-background",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      {children}
    </TabsContent>
  );
});

TabContent.displayName = "TabContent";

export default TabContent;
export type { TabContentProps };
