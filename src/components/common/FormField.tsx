import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
interface Props { label: string; children: ReactNode; error?: string; required?: boolean; hint?: string; className?: string; }
export const FormField = memo(function FormField({ label, children, error, required, hint, className }: Props) {
  return (
    <div className={cn('space-y-1', className)}>
      <label className="text-sm font-medium">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});
