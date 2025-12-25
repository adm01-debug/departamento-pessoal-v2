import { forwardRef } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
interface Props extends Omit<ButtonProps, 'children'> { icon: LucideIcon; label: string; }
export const IconButton = forwardRef<HTMLButtonElement, Props>(({ icon: Icon, label, className, ...props }, ref) => (
  <Button ref={ref} variant="ghost" size="icon" className={cn('h-8 w-8', className)} aria-label={label} {...props}>
    <Icon className="h-4 w-4" />
  </Button>
));
IconButton.displayName = 'IconButton';
