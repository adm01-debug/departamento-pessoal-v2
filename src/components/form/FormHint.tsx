import { cn } from '@/lib/utils';
interface FormHintProps { children: React.ReactNode; className?: string; }
export function FormHint({ children, className }: FormHintProps) {
  return <p className={cn('text-xs text-muted-foreground', className)}>{children}</p>;
}
