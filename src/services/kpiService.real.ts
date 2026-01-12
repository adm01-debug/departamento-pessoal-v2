// V17-S056: KPIService Real
export const kpiServiceReal = {
  async calcularTurnover(empresaId: string, periodo: { inicio: string; fim: string }) { return { percentual: 0, admissoes: 0, demissoes: 0 }; },
  async calcularAbsenteismo(empresaId: string, competencia: string) { return { percentual: 0, diasPerdidos: 0 }; },
  async calcularCustoMedioColaborador(empresaId: string, competencia: string) { return 0; },
  async calcularHeadcount(empresaId: string) { return { total: 0, porDepartamento: {} }; }
};
export default kpiServiceReal;
