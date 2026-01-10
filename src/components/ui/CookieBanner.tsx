import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CookieBannerProps { onAccept: () => void; onDecline?: () => void; className?: string; }

export function CookieBanner({ onAccept, onDecline, className }: CookieBannerProps) {
  return (
    <div className={cn("fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg", className)}>
      <div className="container flex items-center justify-between gap-4">
        <p className="text-sm">Este site usa cookies.</p>
        <div className="flex gap-2">
          {onDecline && <Button variant="outline" onClick={onDecline}>Recusar</Button>}
          <Button onClick={onAccept}>Aceitar</Button>
        </div>
      </div>
    </div>
  );
}
export default CookieBanner;
