import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> { label?: string; error?: string; }
export const TextArea = forwardRef<HTMLTextAreaElement, Props>(({ label, error, className, ...props }, ref) => (
  <div className="space-y-1">
    {label && <label className="text-sm font-medium">{label}</label>}
    <textarea ref={ref} className={cn('w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary', error && 'border-red-500', className)} {...props} />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
));
TextArea.displayName = 'TextArea';
