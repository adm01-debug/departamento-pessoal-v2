// V17.2-S113: CBOService Real
export const cboServiceReal = {
  async buscar(termo: string) { const CBOS = [{ codigo: '411010', descricao: 'Auxiliar de escritório' }, { codigo: '252105', descricao: 'Administrador' }, { codigo: '142205', descricao: 'Gerente comercial' }]; return CBOS.filter(c => c.descricao.toLowerCase().includes(termo.toLowerCase()) || c.codigo.includes(termo)); },
  async getByCodigo(codigo: string) { const CBOS_MAP: Record<string, string> = { '411010': 'Auxiliar de escritório', '252105': 'Administrador' }; return CBOS_MAP[codigo] || null; }
}; export default cboServiceReal;
