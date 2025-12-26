import { createContext, useContext, useState, ReactNode } from 'react';
interface FilterContextType { filters: Record<string, any>; setFilter: (key: string, value: any) => void; clearFilters: () => void; hasFilters: boolean; }
const FilterContext = createContext<FilterContextType | undefined>(undefined);
export function FilterProvider({ children }: { children: ReactNode }) { const [filters, setFilters] = useState<Record<string, any>>({}); const setFilter = (key: string, value: any) => setFilters(f => ({ ...f, [key]: value })); const clearFilters = () => setFilters({}); return <FilterContext.Provider value={{ filters, setFilter, clearFilters, hasFilters: Object.keys(filters).length > 0 }}>{children}</FilterContext.Provider>; }
export function useFilter() { const ctx = useContext(FilterContext); if (!ctx) throw new Error('useFilter must be used within FilterProvider'); return ctx; }
