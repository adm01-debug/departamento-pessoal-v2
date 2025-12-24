/**
 * @module TabPanel
 * @description Painel de conteúdo alternativo para tabs
 * @category Tabs
 */

import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

/**
 * Props do componente TabPanel
 */
interface TabPanelProps {
  /** ID/valor da tab associada */
  id: string;
  /** Conteúdo do painel */
  children: React.ReactNode;
  /** Padding interno */
  padding?: "none" | "sm" | "md" | "lg";
  /** Animação de entrada */
  animate?: boolean;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Mapeamento de padding
 */
const paddingClasses: Record<string, string> = {
  none: "p-0",
  sm: "p-2",
  md: "p-4",
  lg: "p-6",
};

/**
 * TabPanel - Painel de conteúdo da tab
 *
 * @description Container alternativo para conteúdo de tabs
 * com opções de padding e animação
 *
 * @example
 * ```tsx
 * <TabPanel id="info" padding="md">
 *   <InfoContent />
 * </TabPanel>
 * <TabPanel id="detalhes" padding="lg" animate>
 *   <DetalhesContent />
 * </TabPanel>
 * ```
 */
export const TabPanel = React.memo(function TabPanel({
  id,
  children,
  padding = "md",
  animate = true,
  className,
}: TabPanelProps) {
  return (
    <TabsContent
      value={id}
      className={cn(
        paddingClasses[padding],
        animate && "data-[state=active]:animate-in data-[state=active]:fade-in-0",
        animate && "data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      {children}
    </TabsContent>
  );
});

TabPanel.displayName = "TabPanel";

export default TabPanel;
export type { TabPanelProps };
