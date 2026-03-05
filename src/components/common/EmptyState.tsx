import React from 'react';
import { Button } from '@/components/ui/button';
import { FolderOpen, SearchX } from 'lucide-react';

interface Props {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ title, description, icon, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon || <FolderOpen className="w-16 h-16 text-muted-foreground opacity-50" />}
      <h3 className="mt-4 text-lg font-medium">{title}</h3>
      {description && <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>}
      {action && <Button onClick={action.onClick} className="mt-4">{action.label}</Button>}
    </div>
  );
}

export function NoResults({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <SearchX className="w-16 h-16 text-muted-foreground opacity-50" />
      <h3 className="mt-4 text-lg font-medium">{title}</h3>
      {description && <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>}
    </div>
  );
}
