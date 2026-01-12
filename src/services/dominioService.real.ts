// V17.2-S112: DominioService Real
export const dominioServiceReal = {
  getTiposContrato() { return [{ codigo: '1', descricao: 'Prazo Indeterminado' }, { codigo: '2', descricao: 'Prazo Determinado' }, { codigo: '3', descricao: 'Experiência' }]; },
  getCategoriasTrabalhador() { return [{ codigo: '101', descricao: 'Empregado Geral' }, { codigo: '102', descricao: 'Aprendiz' }, { codigo: '103', descricao: 'Contrato temporário' }]; },
  getMotivosAfastamento() { return [{ codigo: '01', descricao: 'Acidente/Doença do Trabalho' }, { codigo: '03', descricao: 'Licença Maternidade' }, { codigo: '15', descricao: 'Férias' }]; }
}; export default dominioServiceReal;
