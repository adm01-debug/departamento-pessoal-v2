/**
 * @module TabsContainer
 * @description Container raiz para sistema de tabs
 * @category Tabs
 */

import React from "react";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

/**
 * Props do componente TabsContainer
 */
interface TabsContainerProps {
  /** Valor da tab ativa */
  value?: string;
  /** Tab padrão inicial */
  defaultValue?: string;
  /** Callback ao mudar tab */
  onValueChange?: (value: string) => void;
  /** Conteúdo (TabList + TabContent) */
  children: React.ReactNode;
  /** Orientação das tabs */
  orientation?: "horizontal" | "vertical";
  /** Ativação automática ao focar */
  activationMode?: "automatic" | "manual";
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * TabsContainer - Container de tabs
 *
 * @description Componente raiz que gerencia o estado
 * e comportamento do sistema de tabs
 *
 * @example
 * ```tsx
 * <TabsContainer defaultValue="tab1">
 *   <TabList>
 *     <TabItem value="tab1">Geral</TabItem>
 *     <TabItem value="tab2">Detalhes</TabItem>
 *   </TabList>
 *   <TabContent value="tab1">Conteúdo 1</TabContent>
 *   <TabContent value="tab2">Conteúdo 2</TabContent>
 * </TabsContainer>
 * ```
 */
export const TabsContainer = React.memo(function TabsContainer({
  value,
  defaultValue,
  onValueChange,
  children,
  orientation = "horizontal",
  activationMode = "automatic",
  className,
}: TabsContainerProps) {
  return (
    <Tabs
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      orientation={orientation}
      activationMode={activationMode}
      className={cn(
        orientation === "vertical" && "flex gap-4",
        className
      )}
    >
      {children}
    </Tabs>
  );
});

TabsContainer.displayName = "TabsContainer";

export default TabsContainer;
export type { TabsContainerProps };
