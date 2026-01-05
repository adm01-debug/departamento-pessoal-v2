export interface DominioConfig { servidor: string; usuario: string; senha: string; }
export class DominioService {
  async exportarFolha(competencia: string): Promise<{ arquivo: string; registros: number }> { return { arquivo: `FOLHA_${competencia}.txt`, registros: 0 }; }
  async importarColaboradores(arquivo: string): Promise<{ importados: number; erros: string[] }> { return { importados: 0, erros: [] }; }
  async sincronizarRubricas(): Promise<{ sincronizadas: number }> { return { sincronizadas: 0 }; }
}
export default DominioService;
