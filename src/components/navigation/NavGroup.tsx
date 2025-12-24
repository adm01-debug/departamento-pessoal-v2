import { memo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
interface NavGroupProps { title: string; children: React.ReactNode; defaultOpen?: boolean; icon?: React.ReactNode; }
export const NavGroup = memo(function NavGroup({ title, children, defaultOpen = false, icon }: NavGroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full px-3 py-2 text-sm hover:bg-muted rounded-lg">
        <span className="flex items-center gap-2">{icon}{title}</span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>
      {open && <div className="ml-4 space-y-1 mt-1">{children}</div>}
    </div>
  );
});
