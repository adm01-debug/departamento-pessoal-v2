import { createContext, useContext, useState, ReactNode } from 'react';
interface PaginationContextType { page: number; pageSize: number; total: number; setPage: (p: number) => void; setPageSize: (s: number) => void; setTotal: (t: number) => void; totalPages: number; }
const PaginationContext = createContext<PaginationContextType | undefined>(undefined);
export function PaginationProvider({ children }: { children: ReactNode }) { const [page, setPage] = useState(1); const [pageSize, setPageSize] = useState(10); const [total, setTotal] = useState(0); return <PaginationContext.Provider value={{ page, pageSize, total, setPage, setPageSize, setTotal, totalPages: Math.ceil(total / pageSize) }}>{children}</PaginationContext.Provider>; }
export function usePagination() { const ctx = useContext(PaginationContext); if (!ctx) throw new Error('usePagination must be used within PaginationProvider'); return ctx; }
