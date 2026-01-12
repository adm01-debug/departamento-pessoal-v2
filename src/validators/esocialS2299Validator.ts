// V17-E016: Validador eSocial S-2299 (Desligamento)
export interface DadosS2299 { cpfTrab: string; matricula: string; dtDeslig: string; mtvDeslig: string; dtProjFimAPI?: string; pensAlim?: number; percAliment?: number; vrAlim?: number; }
export function validateS2299(dados: Partial<DadosS2299>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!dados.cpfTrab) errors.push('CPF do trabalhador obrigatório');
  if (!dados.matricula) errors.push('Matrícula obrigatória');
  if (!dados.dtDeslig) errors.push('Data desligamento obrigatória');
  if (!dados.mtvDeslig) errors.push('Motivo desligamento obrigatório');
  const motivosValidos = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40'];
  if (dados.mtvDeslig && !motivosValidos.includes(dados.mtvDeslig)) errors.push('Motivo desligamento inválido');
  return { valid: errors.length === 0, errors };
}
