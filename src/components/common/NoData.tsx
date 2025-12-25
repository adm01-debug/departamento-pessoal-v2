import { memo, type ReactNode } from 'react';
import { Inbox } from 'lucide-react';
interface Props { title?: string; description?: string; icon?: ReactNode; action?: ReactNode; }
export const NoData = memo(function NoData({ title = 'Sem dados', description, icon, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="p-3 rounded-full bg-muted mb-4">{icon || <Inbox className="h-8 w-8 text-muted-foreground" />}</div>
      <h3 className="text-lg font-medium">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
});
