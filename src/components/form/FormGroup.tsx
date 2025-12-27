import { cn } from '@/lib/utils';
interface FormGroupProps { children: React.ReactNode; className?: string; }
export function FormGroup({ children, className }: FormGroupProps) {
  return <div className={cn('space-y-2', className)}>{children}</div>;
}
