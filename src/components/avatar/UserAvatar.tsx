import { cn } from '@/lib/utils';
interface UserAvatarProps { name: string; image?: string; size?: 'sm' | 'md' | 'lg'; className?: string; }
const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-lg' };
export function UserAvatar({ name, image, size = 'md', className }: UserAvatarProps) {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  return image ? <img src={image} alt={name} className={cn('rounded-full object-cover', sizes[size], className)} /> : <div className={cn('rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium', sizes[size], className)}>{initials}</div>;
}
