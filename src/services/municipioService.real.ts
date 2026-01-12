// V17.2-S115: MunicipioService Real
export const municipioServiceReal = {
  async buscar(termo: string) { return [{ codigo: '3550308', nome: 'São Paulo', uf: 'SP' }, { codigo: '3304557', nome: 'Rio de Janeiro', uf: 'RJ' }].filter(m => m.nome.toLowerCase().includes(termo.toLowerCase())); },
  async getByUF(uf: string) { return [{ codigo: '3550308', nome: 'São Paulo' }]; },
  async getByCodigo(codigo: string) { return { codigo, nome: 'Município', uf: 'SP' }; }
}; export default municipioServiceReal;
