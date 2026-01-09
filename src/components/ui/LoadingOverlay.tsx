import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  blur?: boolean;
  fullScreen?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function LoadingOverlay({ isLoading, text = "Carregando...", blur = true, fullScreen = false, className, children }: LoadingOverlayProps) {
  if (!isLoading) return <>{children}</>;

  const overlay = (
    <div className={cn("absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-50", blur && "backdrop-blur-sm", fullScreen && "fixed", className)}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
    </div>
  );

  if (fullScreen) return overlay;

  return (
    <div className="relative">
      {children}
      {overlay}
    </div>
  );
}
export default LoadingOverlay;
