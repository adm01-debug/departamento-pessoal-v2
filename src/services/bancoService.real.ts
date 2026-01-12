// V17.2-S116: BancoService Real
export const bancoServiceReal = {
  getAll() { return [{ codigo: '001', nome: 'Banco do Brasil' }, { codigo: '033', nome: 'Santander' }, { codigo: '104', nome: 'Caixa Econômica' }, { codigo: '237', nome: 'Bradesco' }, { codigo: '341', nome: 'Itaú' }, { codigo: '260', nome: 'Nubank' }]; },
  getByCodigo(codigo: string) { return this.getAll().find(b => b.codigo === codigo) || null; }
}; export default bancoServiceReal;
