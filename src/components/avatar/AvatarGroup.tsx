import { UserAvatar } from './UserAvatar';
interface AvatarGroupProps { users: { name: string; image?: string }[]; max?: number; size?: 'sm' | 'md' | 'lg'; }
export function AvatarGroup({ users, max = 4, size = 'md' }: AvatarGroupProps) {
  const visible = users.slice(0, max);
  const remaining = users.length - max;
  return (<div className="flex -space-x-2">{visible.map((u, i) => <div key={i} className="ring-2 ring-background rounded-full"><UserAvatar name={u.name} image={u.image} size={size} /></div>)}{remaining > 0 && <div className="ring-2 ring-background rounded-full h-10 w-10 bg-muted flex items-center justify-center text-xs font-medium">+{remaining}</div>}</div>);
}
