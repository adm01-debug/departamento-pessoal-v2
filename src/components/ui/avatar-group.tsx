// V15-183: src/components/ui/avatar-group.tsx
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

interface AvatarItem {
  name: string;
  image?: string;
}

interface AvatarGroupProps {
  avatars: AvatarItem[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-6 w-6 text-xs',
  md: 'h-8 w-8 text-sm',
  lg: 'h-10 w-10 text-base',
};

export function AvatarGroup({ avatars, max = 4, size = 'md', className }: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className={cn('flex -space-x-2', className)}>
      {visible.map((avatar, i) => (
        <Avatar key={i} className={cn(sizeClasses[size], 'border-2 border-background')}>
          {avatar.image && <AvatarImage src={avatar.image} alt={avatar.name} />}
          <AvatarFallback className="text-xs">{getInitials(avatar.name)}</AvatarFallback>
        </Avatar>
      ))}
      {remaining > 0 && (
        <Avatar className={cn(sizeClasses[size], 'border-2 border-background')}>
          <AvatarFallback className="bg-muted">+{remaining}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
