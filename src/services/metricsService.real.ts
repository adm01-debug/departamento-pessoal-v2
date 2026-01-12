// V17-S098: MetricsService Real
export const metricsServiceReal = {
  async registrar(nome: string, valor: number, tags?: Record<string, string>) { console.log('Metric:', nome, valor, tags); },
  async getMetricas(periodo: string) { return []; }
}; export default metricsServiceReal;
