// V17.2-CTX006: FolhaContext
import React, { createContext, useContext, useState, ReactNode } from 'react';
interface FolhaContextType { competencia: string; setCompetencia: (competencia: string) => void; folhaId: string | null; setFolhaId: (id: string | null) => void; status: string; setStatus: (status: string) => void; }
const FolhaContext = createContext<FolhaContextType | undefined>(undefined);
export function FolhaProvider({ children }: { children: ReactNode }) {
  const getCompetenciaAtual = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; };
  const [competencia, setCompetencia] = useState(getCompetenciaAtual());
  const [folhaId, setFolhaId] = useState<string | null>(null);
  const [status, setStatus] = useState('aberta');
  return <FolhaContext.Provider value={{ competencia, setCompetencia, folhaId, setFolhaId, status, setStatus }}>{children}</FolhaContext.Provider>;
}
export function useFolhaContext() { const context = useContext(FolhaContext); if (!context) throw new Error('useFolhaContext must be used within FolhaProvider'); return context; }
