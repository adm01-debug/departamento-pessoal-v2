import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TruncateProps {
  text: string;
  maxLength?: number;
  maxLines?: number;
  expandable?: boolean;
  showTooltip?: boolean;
  className?: string;
}

export function Truncate({ text, maxLength, maxLines, expandable = false, showTooltip = true, className }: TruncateProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current && maxLines) {
      setIsTruncated(ref.current.scrollHeight > ref.current.clientHeight);
    }
  }, [text, maxLines]);

  if (maxLength && text.length > maxLength && !isExpanded) {
    const truncated = text.slice(0, maxLength) + "...";
    const content = (
      <span className={className}>
        {truncated}
        {expandable && <Button variant="link" className="p-0 h-auto ml-1" onClick={() => setIsExpanded(true)}>ver mais</Button>}
      </span>
    );

    if (showTooltip) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent className="max-w-xs">{text}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return content;
  }

  if (maxLines && !isExpanded) {
    return (
      <span ref={ref} className={cn("block", className)} style={{ display: "-webkit-box", WebkitLineClamp: maxLines, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {text}
        {expandable && isTruncated && <Button variant="link" className="p-0 h-auto ml-1" onClick={() => setIsExpanded(true)}>ver mais</Button>}
      </span>
    );
  }

  return (
    <span className={className}>
      {text}
      {expandable && isExpanded && <Button variant="link" className="p-0 h-auto ml-1" onClick={() => setIsExpanded(false)}>ver menos</Button>}
    </span>
  );
}
export default Truncate;
