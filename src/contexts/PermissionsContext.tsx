import { createContext, useContext, useState, ReactNode } from 'react';
interface PermissionsContextType { permissions: string[]; hasPermission: (p: string) => boolean; setPermissions: (p: string[]) => void; }
const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);
export function PermissionsProvider({ children }: { children: ReactNode }) { const [permissions, setPermissions] = useState<string[]>([]); const hasPermission = (p: string) => permissions.includes(p); return <PermissionsContext.Provider value={{ permissions, hasPermission, setPermissions }}>{children}</PermissionsContext.Provider>; }
export function usePermissions() { const ctx = useContext(PermissionsContext); if (!ctx) throw new Error('usePermissions must be used within PermissionsProvider'); return ctx; }
