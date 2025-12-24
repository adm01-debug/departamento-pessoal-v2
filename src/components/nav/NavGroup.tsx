import { memo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
interface NavGroupProps { label: string; children: React.ReactNode; defaultOpen?: boolean; }
export const NavGroup = memo(function NavGroup({ label, children, defaultOpen = true }: NavGroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="space-y-1">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
        {label}<ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>
      {open && <div className="space-y-1">{children}</div>}
    </div>
  );
});
