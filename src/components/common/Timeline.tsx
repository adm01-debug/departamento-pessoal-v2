import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
interface Item { title: string; description?: string; date?: string; icon?: ReactNode; }
interface Props { items: Item[]; className?: string; }
export const Timeline = memo(function Timeline({ items, className }: Props) {
  return (
    <div className={cn('space-y-4', className)}>
      {items.map((item, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-primary" />
            {i < items.length - 1 && <div className="flex-1 w-0.5 bg-gray-200" />}
          </div>
          <div className="pb-4">
            <p className="font-medium">{item.title}</p>
            {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
            {item.date && <p className="text-xs text-muted-foreground mt-1">{item.date}</p>}
          </div>
        </div>
      ))}
    </div>
  );
});
