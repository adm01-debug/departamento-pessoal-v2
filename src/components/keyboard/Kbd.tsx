import { cn } from '@/lib/utils';
interface KbdProps { children: React.ReactNode; className?: string; }
export function Kbd({ children, className }: KbdProps) {
  return <kbd className={cn('px-1.5 py-0.5 text-xs font-mono bg-muted border rounded', className)}>{children}</kbd>;
}
