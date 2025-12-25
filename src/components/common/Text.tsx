import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
type Variant = 'h1'|'h2'|'h3'|'h4'|'body'|'small'|'muted';
const variants: Record<Variant, string> = { h1: 'text-3xl font-bold', h2: 'text-2xl font-semibold', h3: 'text-xl font-semibold', h4: 'text-lg font-medium', body: 'text-base', small: 'text-sm', muted: 'text-sm text-muted-foreground' };
interface Props { children: ReactNode; variant?: Variant; as?: 'h1'|'h2'|'h3'|'h4'|'p'|'span'; className?: string; }
export const Text = memo(function Text({ children, variant = 'body', as: Tag = 'p', className }: Props) {
  return <Tag className={cn(variants[variant], className)}>{children}</Tag>;
});
