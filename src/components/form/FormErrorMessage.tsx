import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
interface FormErrorMessageProps { children: React.ReactNode; className?: string; }
export function FormErrorMessage({ children, className }: FormErrorMessageProps) {
  return <p className={cn('flex items-center gap-1 text-xs text-destructive', className)}><AlertCircle className="h-3 w-3" />{children}</p>;
}
