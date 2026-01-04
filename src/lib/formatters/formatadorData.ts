/**
 * Formatador de Datas
 * Utilitários para manipulação de datas no padrão brasileiro
 */

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const MESES_ABREV = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const DIAS_SEMANA = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const DIAS_SEMANA_ABREV = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

/**
 * Formata data no padrão brasileiro DD/MM/YYYY
 */
export function formatarData(data: Date | string): string {
  const d = typeof data === 'string' ? new Date(data) : data;
  if (isNaN(d.getTime())) return '';
  
  const dia = d.getDate().toString().padStart(2, '0');
  const mes = (d.getMonth() + 1).toString().padStart(2, '0');
  const ano = d.getFullYear();
  
  return `${dia}/${mes}/${ano}`;
}

/**
 * Formata data e hora DD/MM/YYYY HH:mm
 */
export function formatarDataHora(data: Date | string): string {
  const d = typeof data === 'string' ? new Date(data) : data;
  if (isNaN(d.getTime())) return '';
  
  const dataFormatada = formatarData(d);
  const hora = d.getHours().toString().padStart(2, '0');
  const minuto = d.getMinutes().toString().padStart(2, '0');
  
  return `${dataFormatada} ${hora}:${minuto}`;
}

/**
 * Formata data por extenso
 */
export function formatarDataExtenso(data: Date | string): string {
  const d = typeof data === 'string' ? new Date(data) : data;
  if (isNaN(d.getTime())) return '';
  
  return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
}

/**
 * Formata data com dia da semana
 */
export function formatarDataComDiaSemana(data: Date | string): string {
  const d = typeof data === 'string' ? new Date(data) : data;
  if (isNaN(d.getTime())) return '';
  
  return `${DIAS_SEMANA[d.getDay()]}, ${formatarDataExtenso(d)}`;
}

/**
 * Converte string DD/MM/YYYY para Date
 */
export function parseDataBR(dataString: string): Date | null {
  const partes = dataString.split('/');
  if (partes.length !== 3) return null;
  
  const dia = parseInt(partes[0], 10);
  const mes = parseInt(partes[1], 10) - 1;
  const ano = parseInt(partes[2], 10);
  
  const data = new Date(ano, mes, dia);
  if (isNaN(data.getTime())) return null;
  
  return data;
}

/**
 * Formata para ISO (YYYY-MM-DD)
 */
export function formatarISO(data: Date | string): string {
  const d = typeof data === 'string' ? new Date(data) : data;
  if (isNaN(d.getTime())) return '';
  
  return d.toISOString().split('T')[0];
}

/**
 * Calcula diferença em dias
 */
export function diferencaEmDias(dataInicio: Date | string, dataFim: Date | string): number {
  const d1 = typeof dataInicio === 'string' ? new Date(dataInicio) : dataInicio;
  const d2 = typeof dataFim === 'string' ? new Date(dataFim) : dataFim;
  
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calcula idade
 */
export function calcularIdade(dataNascimento: Date | string): number {
  const nascimento = typeof dataNascimento === 'string' ? new Date(dataNascimento) : dataNascimento;
  const hoje = new Date();
  
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mesAtual = hoje.getMonth();
  const mesNascimento = nascimento.getMonth();
  
  if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  
  return idade;
}

/**
 * Formata tempo relativo (há 2 dias, daqui a 3 meses)
 */
export function formatarTempoRelativo(data: Date | string): string {
  const d = typeof data === 'string' ? new Date(data) : data;
  const agora = new Date();
  const diffMs = d.getTime() - agora.getTime();
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDias === 0) return 'Hoje';
  if (diffDias === 1) return 'Amanhã';
  if (diffDias === -1) return 'Ontem';
  
  if (diffDias > 0) {
    if (diffDias < 7) return `Daqui a ${diffDias} dias`;
    if (diffDias < 30) return `Daqui a ${Math.floor(diffDias / 7)} semanas`;
    if (diffDias < 365) return `Daqui a ${Math.floor(diffDias / 30)} meses`;
    return `Daqui a ${Math.floor(diffDias / 365)} anos`;
  } else {
    const dias = Math.abs(diffDias);
    if (dias < 7) return `Há ${dias} dias`;
    if (dias < 30) return `Há ${Math.floor(dias / 7)} semanas`;
    if (dias < 365) return `Há ${Math.floor(dias / 30)} meses`;
    return `Há ${Math.floor(dias / 365)} anos`;
  }
}

/**
 * Adiciona dias a uma data
 */
export function adicionarDias(data: Date | string, dias: number): Date {
  const d = typeof data === 'string' ? new Date(data) : new Date(data);
  d.setDate(d.getDate() + dias);
  return d;
}

/**
 * Adiciona meses a uma data
 */
export function adicionarMeses(data: Date | string, meses: number): Date {
  const d = typeof data === 'string' ? new Date(data) : new Date(data);
  d.setMonth(d.getMonth() + meses);
  return d;
}

/**
 * Primeiro dia do mês
 */
export function primeiroDiaMes(data: Date | string = new Date()): Date {
  const d = typeof data === 'string' ? new Date(data) : new Date(data);
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/**
 * Último dia do mês
 */
export function ultimoDiaMes(data: Date | string = new Date()): Date {
  const d = typeof data === 'string' ? new Date(data) : new Date(data);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

/**
 * Verifica se é dia útil (exclui fim de semana)
 */
export function isDiaUtil(data: Date | string): boolean {
  const d = typeof data === 'string' ? new Date(data) : data;
  const diaSemana = d.getDay();
  return diaSemana !== 0 && diaSemana !== 6;
}

/**
 * Obtém nome do mês
 */
export function obterNomeMes(mes: number, abreviado: boolean = false): string {
  const lista = abreviado ? MESES_ABREV : MESES;
  return lista[mes] || '';
}

/**
 * Obtém nome do dia da semana
 */
export function obterNomeDiaSemana(dia: number, abreviado: boolean = false): string {
  const lista = abreviado ? DIAS_SEMANA_ABREV : DIAS_SEMANA;
  return lista[dia] || '';
}

export default {
  formatarData,
  formatarDataHora,
  formatarDataExtenso,
  formatarDataComDiaSemana,
  parseDataBR,
  formatarISO,
  diferencaEmDias,
  calcularIdade,
  formatarTempoRelativo,
  adicionarDias,
  adicionarMeses,
  primeiroDiaMes,
  ultimoDiaMes,
  isDiaUtil,
  obterNomeMes,
  obterNomeDiaSemana,
  MESES,
  MESES_ABREV,
  DIAS_SEMANA,
  DIAS_SEMANA_ABREV
};
