import { createContext, useContext, useState, ReactNode } from 'react';
interface Breadcrumb { label: string; path: string; }
interface BreadcrumbContextType { breadcrumbs: Breadcrumb[]; setBreadcrumbs: (b: Breadcrumb[]) => void; addBreadcrumb: (b: Breadcrumb) => void; }
const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);
export function BreadcrumbProvider({ children }: { children: ReactNode }) { const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]); const addBreadcrumb = (b: Breadcrumb) => setBreadcrumbs(prev => [...prev, b]); return <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs, addBreadcrumb }}>{children}</BreadcrumbContext.Provider>; }
export function useBreadcrumb() { const ctx = useContext(BreadcrumbContext); if (!ctx) throw new Error('useBreadcrumb must be used within BreadcrumbProvider'); return ctx; }
