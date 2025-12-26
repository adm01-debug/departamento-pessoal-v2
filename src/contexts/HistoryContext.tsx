import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
interface HistoryEntry { path: string; timestamp: number; title?: string; }
interface HistoryContextType { history: HistoryEntry[]; addEntry: (path: string, title?: string) => void; goBack: () => HistoryEntry | null; clear: () => void; }
const HistoryContext = createContext<HistoryContextType | undefined>(undefined);
export function HistoryProvider({ children }: { children: ReactNode }) { const [history, setHistory] = useState<HistoryEntry[]>([]); const addEntry = useCallback((path: string, title?: string) => setHistory(h => [...h, { path, timestamp: Date.now(), title }]), []); const goBack = useCallback(() => { if (history.length === 0) return null; const last = history[history.length - 1]; setHistory(h => h.slice(0, -1)); return last; }, [history]); const clear = useCallback(() => setHistory([]), []); return <HistoryContext.Provider value={{ history, addEntry, goBack, clear }}>{children}</HistoryContext.Provider>; }
export function useHistory() { const ctx = useContext(HistoryContext); if (!ctx) throw new Error('useHistory must be used within HistoryProvider'); return ctx; }
