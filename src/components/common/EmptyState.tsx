import React from 'react';
import { LucideIcon, FileQuestion, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon = FileQuestion, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="w-16 h-16 text-muted-foreground/50 mb-4" />
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="text-muted-foreground mt-1 max-w-md">{description}</p>}
      {action && (
        <Button onClick={action.onClick} className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  );
}

// NoResults - used by DataTable
export function NoResults({ message = "Nenhum resultado encontrado" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Search className="w-12 h-12 text-muted-foreground/50 mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

export default EmptyState;
