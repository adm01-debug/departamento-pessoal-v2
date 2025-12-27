import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
interface InternalLinkProps { to: string; children: React.ReactNode; className?: string; }
export function InternalLink({ to, children, className }: InternalLinkProps) {
  return <Link to={to} className={cn('text-primary hover:underline', className)}>{children}</Link>;
}
