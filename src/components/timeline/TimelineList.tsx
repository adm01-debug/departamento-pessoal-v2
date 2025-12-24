/**
 * @module TimelineList
 * @description Lista de timeline para histórico de eventos
 * @category Timeline
 */

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Item da timeline
 */
interface TimelineEvent {
  /** ID único */
  id: string;
  /** Título do evento */
  title: string;
  /** Descrição */
  description?: string;
  /** Data/hora */
  date: string;
  /** Tipo/status do evento */
  type?: "default" | "success" | "warning" | "error" | "info";
  /** Ícone customizado */
  icon?: React.ReactNode;
}

/**
 * Props do componente TimelineList
 */
interface TimelineListProps {
  /** Lista de eventos */
  events: TimelineEvent[];
  /** Orientação */
  orientation?: "vertical" | "horizontal";
  /** Mostrar linha conectora */
  showLine?: boolean;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Cores por tipo
 */
const typeColors: Record<string, string> = {
  default: "bg-gray-400",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  error: "bg-red-500",
  info: "bg-blue-500",
};

/**
 * TimelineList - Lista de eventos em timeline
 *
 * @description Exibe uma sequência de eventos em formato
 * de linha do tempo com marcadores visuais
 *
 * @example
 * ```tsx
 * <TimelineList
 *   events={[
 *     { id: "1", title: "Criado", date: "10:00", type: "info" },
 *     { id: "2", title: "Aprovado", date: "14:30", type: "success" },
 *   ]}
 * />
 * ```
 */
export const TimelineList = React.memo(function TimelineList({
  events,
  orientation = "vertical",
  showLine = true,
  className,
}: TimelineListProps) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        Nenhum evento registrado
      </p>
    );
  }

  return (
    <div
      className={cn(
        orientation === "vertical" ? "space-y-4" : "flex gap-4 overflow-x-auto",
        className
      )}
    >
      {events.map((event, index) => (
        <div
          key={event.id}
          className={cn(
            "relative flex gap-3",
            orientation === "vertical" ? "flex-row" : "flex-col items-center"
          )}
        >
          {/* Marcador */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-3 h-3 rounded-full z-10",
                typeColors[event.type || "default"]
              )}
            />
            {/* Linha conectora */}
            {showLine && index < events.length - 1 && (
              <div
                className={cn(
                  "bg-border",
                  orientation === "vertical" 
                    ? "w-0.5 flex-1 min-h-[24px]" 
                    : "h-0.5 w-full mt-1"
                )}
              />
            )}
          </div>

          {/* Conteúdo */}
          <div className={cn("flex-1 pb-4", orientation === "horizontal" && "text-center")}>
            <p className="text-sm font-medium">{event.title}</p>
            {event.description && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {event.description}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">{event.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
});

TimelineList.displayName = "TimelineList";

export default TimelineList;
export type { TimelineListProps, TimelineEvent };
