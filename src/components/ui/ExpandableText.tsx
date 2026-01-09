import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ExpandableTextProps { text: string; maxLines?: number; className?: string; }

export function ExpandableText({ text, maxLines = 3, className }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={className}>
      <p className={cn("text-sm", !expanded && `line-clamp-${maxLines}`)} style={!expanded ? { display: "-webkit-box", WebkitLineClamp: maxLines, WebkitBoxOrient: "vertical", overflow: "hidden" } : undefined}>{text}</p>
      <Button variant="link" className="p-0 h-auto text-xs" onClick={() => setExpanded(!expanded)}>{expanded ? "Ver menos" : "Ver mais"}</Button>
    </div>
  );
}
export default ExpandableText;
