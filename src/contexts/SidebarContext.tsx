import { createContext, useContext, useState, ReactNode } from 'react';
interface SidebarContextType { isOpen: boolean; toggle: () => void; open: () => void; close: () => void; }
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);
export function SidebarProvider({ children }: { children: ReactNode }) { const [isOpen, setIsOpen] = useState(true); const toggle = () => setIsOpen(o => !o); const open = () => setIsOpen(true); const close = () => setIsOpen(false); return <SidebarContext.Provider value={{ isOpen, toggle, open, close }}>{children}</SidebarContext.Provider>; }
export function useSidebar() { const ctx = useContext(SidebarContext); if (!ctx) throw new Error('useSidebar must be used within SidebarProvider'); return ctx; }
