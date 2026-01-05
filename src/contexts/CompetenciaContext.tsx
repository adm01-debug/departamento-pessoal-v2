import React, { createContext, useContext, useState, useCallback } from "react";
interface Competencia { mes: number; ano: number; label: string; }
interface CompetenciaContextType { competencia: Competencia; setCompetencia: (competencia: Competencia) => void; proximaCompetencia: () => void; competenciaAnterior: () => void; }
const CompetenciaContext = createContext<CompetenciaContextType | null>(null);
const formatCompetencia = (mes: number, ano: number): string => `${String(mes).padStart(2, "0")}/${ano}`;
export function CompetenciaProvider({ children }: { children: React.ReactNode }) {
  const now = new Date();
  const [competencia, setCompetenciaState] = useState<Competencia>({ mes: now.getMonth() + 1, ano: now.getFullYear(), label: formatCompetencia(now.getMonth() + 1, now.getFullYear()) });
  const setCompetencia = useCallback((comp: Competencia) => { setCompetenciaState({ ...comp, label: formatCompetencia(comp.mes, comp.ano) }); }, []);
  const proximaCompetencia = useCallback(() => { setCompetenciaState(prev => { const newMes = prev.mes === 12 ? 1 : prev.mes + 1; const newAno = prev.mes === 12 ? prev.ano + 1 : prev.ano; return { mes: newMes, ano: newAno, label: formatCompetencia(newMes, newAno) }; }); }, []);
  const competenciaAnterior = useCallback(() => { setCompetenciaState(prev => { const newMes = prev.mes === 1 ? 12 : prev.mes - 1; const newAno = prev.mes === 1 ? prev.ano - 1 : prev.ano; return { mes: newMes, ano: newAno, label: formatCompetencia(newMes, newAno) }; }); }, []);
  return <CompetenciaContext.Provider value={{ competencia, setCompetencia, proximaCompetencia, competenciaAnterior }}>{children}</CompetenciaContext.Provider>;
}
export const useCompetencia = () => { const ctx = useContext(CompetenciaContext); if (!ctx) throw new Error("useCompetencia must be used within CompetenciaProvider"); return ctx; };
export default CompetenciaContext;
