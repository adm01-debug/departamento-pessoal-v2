// V15-186: src/components/ui/copy-button.tsx
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Check, Copy } from 'lucide-react';

interface CopyButtonProps {
  value: string;
  className?: string;
}

export function CopyButton({ value, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="ghost" size="icon" className={cn('h-8 w-8', className)} onClick={copy}>
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}

export function CopyField({ label, value }: { label?: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-sm text-muted-foreground">{label}:</span>}
      <code className="flex-1 px-2 py-1 bg-muted rounded text-sm font-mono truncate">{value}</code>
      <CopyButton value={value} />
    </div>
  );
}
