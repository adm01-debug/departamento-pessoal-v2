/**
 * @fileoverview Componente de estado vazio
 * @module components/common/EmptyState
 */
import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { FileX, Search, Users, Calendar, FileText, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  variant?: 'default' | 'compact';
  children?: ReactNode;
}

const defaultIcons: Record<string, LucideIcon> = {
  search: Search,
  users: Users,
  calendar: Calendar,
  document: FileText,
  default: FileX,
};

export const EmptyState = memo(function EmptyState({
  icon: Icon = FileX,
  title,
  description,
  action,
  className,
  variant = 'default',
  children,
}: EmptyStateProps) {
  const isCompact = variant === 'compact';

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        isCompact ? 'py-8' : 'py-16',
        className
      )}
    >
      <div
        className={cn(
          'rounded-full bg-muted flex items-center justify-center',
          isCompact ? 'h-12 w-12' : 'h-16 w-16'
        )}
      >
        <Icon className={cn('text-muted-foreground', isCompact ? 'h-6 w-6' : 'h-8 w-8')} />
      </div>
      <h3
        className={cn(
          'font-semibold text-foreground mt-4',
          isCompact ? 'text-base' : 'text-lg'
        )}
      >
        {title}
      </h3>
      {description && (
        <p
          className={cn(
            'text-muted-foreground max-w-sm mt-2',
            isCompact ? 'text-sm' : 'text-base'
          )}
        >
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} className="mt-4" size={isCompact ? 'sm' : 'default'}>
          {action.label}
        </Button>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
});

// Alias for NoResults
export const NoResults = EmptyState;

export { defaultIcons };
