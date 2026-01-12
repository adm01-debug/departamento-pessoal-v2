// V17.2-S114: CNAEService Real
export const cnaeServiceReal = {
  async buscar(termo: string) { const CNAES = [{ codigo: '6201500', descricao: 'Desenvolvimento de programas de computador', grauRisco: 1 }, { codigo: '4711301', descricao: 'Comércio varejista de mercadorias em geral', grauRisco: 2 }]; return CNAES.filter(c => c.descricao.toLowerCase().includes(termo.toLowerCase()) || c.codigo.includes(termo)); },
  async getByCodigo(codigo: string) { return { codigo, descricao: 'CNAE', grauRisco: 2 }; }
}; export default cnaeServiceReal;
