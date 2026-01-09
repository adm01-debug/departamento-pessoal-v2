import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ProcessingOverlayProps { visible: boolean; message?: string; className?: string; }

export function ProcessingOverlay({ visible, message, className }: ProcessingOverlayProps) {
  if (!visible) return null;
  return (
    <div className={cn("absolute inset-0 bg-background/80 flex items-center justify-center z-50", className)}>
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </div>
    </div>
  );
}
export default ProcessingOverlay;
