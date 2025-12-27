import { useRBAC } from '@/hooks/useRBAC';
interface CanProps { permission: string; children: React.ReactNode; fallback?: React.ReactNode; }
export function Can({ permission, children, fallback = null }: CanProps) {
  const { hasPermission } = useRBAC();
  return hasPermission(permission) ? <>{children}</> : <>{fallback}</>;
}
