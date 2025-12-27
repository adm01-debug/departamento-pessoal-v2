import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { loading?: boolean; icon?: React.ReactNode; variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'; }
export function ActionButton({ children, loading, icon, variant = 'default', className, disabled, ...props }: ActionButtonProps) {
  return (<Button variant={variant} disabled={disabled || loading} className={cn('gap-2', className)} {...props}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}{children}</Button>);
}
