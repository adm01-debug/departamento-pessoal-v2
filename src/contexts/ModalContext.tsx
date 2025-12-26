import { createContext, useContext, useState, ReactNode } from 'react';
interface ModalContextType { isOpen: boolean; content: ReactNode | null; open: (content: ReactNode) => void; close: () => void; }
const ModalContext = createContext<ModalContextType | undefined>(undefined);
export function ModalProvider({ children }: { children: ReactNode }) { const [isOpen, setIsOpen] = useState(false); const [content, setContent] = useState<ReactNode | null>(null); const open = (c: ReactNode) => { setContent(c); setIsOpen(true); }; const close = () => { setIsOpen(false); setContent(null); }; return <ModalContext.Provider value={{ isOpen, content, open, close }}>{children}</ModalContext.Provider>; }
export function useModal() { const ctx = useContext(ModalContext); if (!ctx) throw new Error('useModal must be used within ModalProvider'); return ctx; }
