import { memo } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Loader2, type LucideIcon } from 'lucide-react';
interface Props extends ButtonProps { loading?: boolean; icon?: LucideIcon; }
export const ActionButton = memo(function ActionButton({ loading, icon: Icon, children, disabled, ...props }: Props) {
  return (
    <Button disabled={disabled || loading} {...props}>
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : Icon && <Icon className="mr-2 h-4 w-4" />}
      {children}
    </Button>
  );
});
