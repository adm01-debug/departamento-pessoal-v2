import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
interface UserInfoProps { name: string; email?: string; role?: string; avatar?: string; size?: 'sm' | 'md' | 'lg'; }
const sizes = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' };
export function UserInfo({ name, email, role, avatar, size = 'md' }: UserInfoProps) {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  return (<div className="flex items-center gap-3"><Avatar className={sizes[size]}><AvatarImage src={avatar} /><AvatarFallback>{initials}</AvatarFallback></Avatar><div><p className="font-medium">{name}</p>{email && <p className="text-xs text-muted-foreground">{email}</p>}{role && <p className="text-xs text-muted-foreground">{role}</p>}</div></div>);
}
