// V15-201: src/components/forms/FormTextarea.tsx
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { forwardRef } from 'react';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  description?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, description, className, id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="space-y-2">
        {label && <Label htmlFor={inputId} className={cn(error && 'text-destructive')}>{label}</Label>}
        <Textarea ref={ref} id={inputId} className={cn(error && 'border-destructive', className)} {...props} />
        {description && !error && <p className="text-sm text-muted-foreground">{description}</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';
