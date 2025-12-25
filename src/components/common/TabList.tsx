import { memo } from 'react';
import { cn } from '@/lib/utils';
interface Tab { id: string; label: string; count?: number; }
interface Props { tabs: Tab[]; active: string; onChange: (id: string) => void; className?: string; }
export const TabList = memo(function TabList({ tabs, active, onChange, className }: Props) {
  return (
    <div className={cn('flex border-b', className)}>
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => onChange(tab.id)} className={cn('px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors', active === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}>
          {tab.label}{tab.count !== undefined && <span className="ml-2 px-2 py-0.5 rounded-full bg-muted text-xs">{tab.count}</span>}
        </button>
      ))}
    </div>
  );
});
