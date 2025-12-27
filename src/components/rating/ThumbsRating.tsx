import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface ThumbsRatingProps { value?: 'up' | 'down' | null; onChange?: (v: 'up' | 'down' | null) => void; }
export function ThumbsRating({ value, onChange }: ThumbsRatingProps) {
  return (<div className="flex gap-2"><Button variant={value === 'up' ? 'default' : 'outline'} size="sm" onClick={() => onChange?.(value === 'up' ? null : 'up')}><ThumbsUp className="h-4 w-4" /></Button><Button variant={value === 'down' ? 'default' : 'outline'} size="sm" onClick={() => onChange?.(value === 'down' ? null : 'down')}><ThumbsDown className="h-4 w-4" /></Button></div>);
}
