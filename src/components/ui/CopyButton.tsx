import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps extends Omit<ButtonProps, "onClick"> {
  text: string;
  onCopy?: () => void;
  successDuration?: number;
  tooltipText?: string;
  successText?: string;
}

export function CopyButton({ text, onCopy, successDuration = 2000, tooltipText = "Copiar", successText = "Copiado!", className, children, ...props }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), successDuration);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className={cn("h-8 w-8", className)} onClick={handleCopy} {...props}>
            {copied ? <Check className="h-4 w-4 text-green-500" /> : children || <Copy className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{copied ? successText : tooltipText}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface CopyFieldProps {
  value: string;
  label?: string;
  className?: string;
}

export function CopyField({ value, label, className }: CopyFieldProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
      <code className="flex-1 px-2 py-1 bg-muted rounded text-sm font-mono truncate">{value}</code>
      <CopyButton text={value} />
    </div>
  );
}

export default CopyButton;
