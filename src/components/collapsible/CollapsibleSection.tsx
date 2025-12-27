import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
interface CollapsibleSectionProps { title: string; children: React.ReactNode; defaultOpen?: boolean; className?: string; }
export function CollapsibleSection({ title, children, defaultOpen = false, className }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (<div className={cn('border rounded-lg', className)}><button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full p-4 text-left font-medium"><span>{title}</span><ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} /></button>{open && <div className="p-4 pt-0">{children}</div>}</div>);
}
