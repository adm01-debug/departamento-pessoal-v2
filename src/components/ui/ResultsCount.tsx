import React from "react";
import { cn } from "@/lib/utils";

interface ResultsCountProps {
  total: number;
  filtered?: number;
  showing?: { from: number; to: number };
  className?: string;
}

export function ResultsCount({ total, filtered, showing, className }: ResultsCountProps) {
  if (showing) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        Mostrando {showing.from}-{showing.to} de {filtered !== undefined ? filtered : total}
        {filtered !== undefined && filtered !== total && ` (${total} total)`}
      </p>
    );
  }

  if (filtered !== undefined && filtered !== total) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        {filtered} resultado{filtered !== 1 && "s"} de {total}
      </p>
    );
  }

  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      {total} resultado{total !== 1 && "s"}
    </p>
  );
}
export default ResultsCount;
