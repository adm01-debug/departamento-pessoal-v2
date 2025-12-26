import { createContext, useContext, useState, ReactNode } from 'react';
interface LoadingContextType { isLoading: boolean; setLoading: (l: boolean) => void; loadingText?: string; setLoadingText: (t: string) => void; }
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);
export function LoadingProvider({ children }: { children: ReactNode }) { const [isLoading, setLoading] = useState(false); const [loadingText, setLoadingText] = useState<string>(); return <LoadingContext.Provider value={{ isLoading, setLoading, loadingText, setLoadingText }}>{children}</LoadingContext.Provider>; }
export function useLoading() { const ctx = useContext(LoadingContext); if (!ctx) throw new Error('useLoading must be used within LoadingProvider'); return ctx; }
