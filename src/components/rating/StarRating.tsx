import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
interface StarRatingProps { value: number; max?: number; onChange?: (v: number) => void; readonly?: boolean; size?: 'sm' | 'md' | 'lg'; }
const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };
export function StarRating({ value, max = 5, onChange, readonly = false, size = 'md' }: StarRatingProps) {
  return (<div className="flex gap-1">{Array.from({ length: max }, (_, i) => (<button key={i} type="button" disabled={readonly} onClick={() => onChange?.(i + 1)} className={cn('transition-colors', readonly ? 'cursor-default' : 'cursor-pointer hover:text-yellow-400')}><Star className={cn(sizes[size], i < value ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground')} /></button>))}</div>);
}
