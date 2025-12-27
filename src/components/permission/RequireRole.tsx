import { useRBAC } from '@/hooks/useRBAC';
interface RequireRoleProps { roles: string[]; children: React.ReactNode; fallback?: React.ReactNode; }
export function RequireRole({ roles, children, fallback = null }: RequireRoleProps) {
  const { hasRole } = useRBAC();
  return roles.some(r => hasRole(r)) ? <>{children}</> : <>{fallback}</>;
}
