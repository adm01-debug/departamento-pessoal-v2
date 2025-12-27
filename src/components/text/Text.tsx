import { cn } from '@/lib/utils';
interface TextProps { children: React.ReactNode; size?: 'xs' | 'sm' | 'base' | 'lg'; weight?: 'normal' | 'medium' | 'semibold' | 'bold'; muted?: boolean; className?: string; }
export function Text({ children, size = 'base', weight = 'normal', muted = false, className }: TextProps) {
  return <span className={cn(`text-${size}`, `font-${weight}`, muted && 'text-muted-foreground', className)}>{children}</span>;
}
