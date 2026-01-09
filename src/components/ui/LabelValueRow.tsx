import React from "react";
import { cn } from "@/lib/utils";

interface LabelValueRowProps { label: string; value: React.ReactNode; icon?: React.ReactNode; copyable?: boolean; className?: string; }

export function LabelValueRow({ label, value, icon, copyable, className }: LabelValueRowProps) {
  const handleCopy = () => { if (typeof value === "string") navigator.clipboard.writeText(value); };
  return (
    <div className={cn("flex items-center justify-between py-2 border-b last:border-0", className)}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">{icon}{label}</div>
      <div className={cn("font-medium", copyable && "cursor-pointer hover:text-primary")} onClick={copyable ? handleCopy : undefined}>{value || "-"}</div>
    </div>
  );
}
export default LabelValueRow;
