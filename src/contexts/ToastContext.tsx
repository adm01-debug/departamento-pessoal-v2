import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
interface Toast { id: string; message: string; type: 'success' | 'error' | 'warning' | 'info'; }
interface ToastContextType { toasts: Toast[]; addToast: (message: string, type?: Toast['type']) => void; removeToast: (id: string) => void; }
const ToastContext = createContext<ToastContextType | undefined>(undefined);
export function ToastProvider({ children }: { children: ReactNode }) { const [toasts, setToasts] = useState<Toast[]>([]); const addToast = useCallback((message: string, type: Toast['type'] = 'info') => { const id = crypto.randomUUID(); setToasts(t => [...t, { id, message, type }]); setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 5000); }, []); const removeToast = useCallback((id: string) => setToasts(t => t.filter(x => x.id !== id)), []); return <ToastContext.Provider value={{ toasts, addToast, removeToast }}>{children}</ToastContext.Provider>; }
export function useToast() { const ctx = useContext(ToastContext); if (!ctx) throw new Error('useToast must be used within ToastProvider'); return ctx; }
