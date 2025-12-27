import { cn } from '@/lib/utils';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
interface LikeDislikeProps { liked?: boolean | null; onLike?: () => void; onDislike?: () => void; className?: string; }
export function LikeDislike({ liked, onLike, onDislike, className }: LikeDislikeProps) {
  return (<div className={cn('flex gap-2', className)}><button onClick={onLike} className={cn('p-1 rounded', liked === true && 'text-green-500')}><ThumbsUp className="h-5 w-5" /></button><button onClick={onDislike} className={cn('p-1 rounded', liked === false && 'text-red-500')}><ThumbsDown className="h-5 w-5" /></button></div>);
}
