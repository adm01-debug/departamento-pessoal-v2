import React from "react";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

interface VersionInfoProps { version: string; buildDate?: string; environment?: string; className?: string; }

export function VersionInfo({ version, buildDate, environment, className }: VersionInfoProps) {
  return (
    <div className={cn("flex items-center gap-2 text-xs text-muted-foreground", className)}>
      <Info className="h-3 w-3" />
      <span>v{version}</span>
      {environment && <span className="px-1.5 py-0.5 bg-muted rounded text-[10px] uppercase">{environment}</span>}
      {buildDate && <span>• {buildDate}</span>}
    </div>
  );
}
export default VersionInfo;
