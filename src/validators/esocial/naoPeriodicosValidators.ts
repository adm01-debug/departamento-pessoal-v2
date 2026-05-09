/**
 * Validadores eSocial — Eventos Não-Periódicos (S-2xxx, S-3xxx)
 */
import { ValidationResult, ValidationError, ValidationWarning, required, maxLen, cpfValido, enumValido, dataValida } from './helpers';

export function validarS2190(dados: Record<string, any>): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  required(dados.cpfTrab, 'cpfTrab', errors);
  cpfValido(dados.cpfTrab, 'cpfTrab', errors);
  required(dados.dtNascto, 'dtNascto', errors);
  dataValida(dados.dtNascto, 'dtNascto', errors);
  required(dados.dtAdm, 'dtAdm', errors);
  dataValida(dados.dtAdm, 'dtAdm', errors);
  if (dados.dtAdm && dados.dtNascto) {
    const nascimento = new Date(dados.dtNascto);
    const admissao = new Date(dados.dtAdm);
    const idade = (admissao.getTime() - nascimento.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    if (idade < 14) errors.push({ campo: 'dtNascto', mensagem: 'Trabalhador deve ter pelo menos 14 anos', regra: 'REGRA_IDADE_MINIMA' });
    if (idade < 16) warnings.push({ campo: 'dtNascto', mensagem: 'Menor aprendiz requer contrato especial' });
  }
  return { valid: errors.length === 0, errors, warnings };
}

export function validarS2200(dados: Record<string, any>): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  required(dados.cpfTrab, 'cpfTrab', errors);
  cpfValido(dados.cpfTrab, 'cpfTrab', errors);
  required(dados.nmTrab, 'nmTrab', errors);
  maxLen(dados.nmTrab, 70, 'nmTrab', errors);
  required(dados.dtNascto, 'dtNascto', errors);
  dataValida(dados.dtNascto, 'dtNascto', errors);
  required(dados.dtAdm, 'dtAdm', errors);
  dataValida(dados.dtAdm, 'dtAdm', errors);
  required(dados.tpRegTrab, 'tpRegTrab', errors);
  enumValido(dados.tpRegTrab?.toString(), ['1', '2'], 'tpRegTrab', errors);
  required(dados.tpRegPrev, 'tpRegPrev', errors);
  enumValido(dados.tpRegPrev?.toString(), ['1', '2', '3'], 'tpRegPrev', errors);
  
  if (dados.dtAdm && dados.dtNascto) {
    const nascimento = new Date(dados.dtNascto);
    const admissao = new Date(dados.dtAdm);
    const idade = (admissao.getTime() - nascimento.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    if (idade < 14) errors.push({ campo: 'dtNascto', mensagem: 'Trabalhador deve ter pelo menos 14 anos', regra: 'REGRA_IDADE_MINIMA' });
  }

  required(dados.codCargo, 'codCargo', errors);
  required(dados.vrSalFx, 'vrSalFx', errors);
  if (dados.vrSalFx !== undefined && dados.vrSalFx <= 0) {
    errors.push({ campo: 'vrSalFx', mensagem: 'Salário deve ser maior que zero', regra: 'REGRA_VALOR_POSITIVO' });
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validarS2205(dados: Record<string, any>): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  required(dados.cpfTrab, 'cpfTrab', errors);
  cpfValido(dados.cpfTrab, 'cpfTrab', errors);
  required(dados.dtAlteracao, 'dtAlteracao', errors);
  dataValida(dados.dtAlteracao, 'dtAlteracao', errors);
  required(dados.nmTrab, 'nmTrab', errors);
  maxLen(dados.nmTrab, 70, 'nmTrab', errors);
  if (dados.grauInstr) {
    const validos = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    enumValido(dados.grauInstr, validos, 'grauInstr', errors);
  }
  return { valid: errors.length === 0, errors, warnings };
}

export function validarS2206(dados: Record<string, any>): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  required(dados.cpfTrab, 'cpfTrab', errors);
  cpfValido(dados.cpfTrab, 'cpfTrab', errors);
  required(dados.dtAlteracao, 'dtAlteracao', errors);
  dataValida(dados.dtAlteracao, 'dtAlteracao', errors);
  required(dados.vrSalFx, 'vrSalFx', errors);
  if (dados.vrSalFx !== undefined && dados.vrSalFx <= 0) {
    errors.push({ campo: 'vrSalFx', mensagem: 'Salário deve ser maior que zero', regra: 'REGRA_VALOR_POSITIVO' });
  }
  required(dados.undSalFixo, 'undSalFixo', errors);
  enumValido(dados.undSalFixo?.toString(), ['1','2','3','4','5','6','7'], 'undSalFixo', errors);
  required(dados.tpContr, 'tpContr', errors);
  return { valid: errors.length === 0, errors, warnings };
}

export function validarS2230(dados: Record<string, any>): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  required(dados.cpfTrab, 'cpfTrab', errors);
  cpfValido(dados.cpfTrab, 'cpfTrab', errors);
  required(dados.dtIniAfast, 'dtIniAfast', errors);
  dataValida(dados.dtIniAfast, 'dtIniAfast', errors);
  required(dados.codMotAfast, 'codMotAfast', errors);
  const motivosValidos = ['01','03','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','33','34','35','36','37'];
  enumValido(dados.codMotAfast, motivosValidos, 'codMotAfast', errors);
  if (dados.dtTermAfast) {
    dataValida(dados.dtTermAfast, 'dtTermAfast', errors);
    if (dados.dtIniAfast && new Date(dados.dtTermAfast) < new Date(dados.dtIniAfast)) {
      errors.push({ campo: 'dtTermAfast', mensagem: 'Data término não pode ser anterior ao início', regra: 'REGRA_DATA_ORDEM' });
    }
  }
  if (['01','03'].includes(dados.codMotAfast) && dados.dtIniAfast && dados.dtTermAfast) {
    const dias = Math.ceil((new Date(dados.dtTermAfast).getTime() - new Date(dados.dtIniAfast).getTime()) / (24*60*60*1000));
    if (dias > 15) warnings.push({ campo: 'codMotAfast', mensagem: 'Afastamento > 15 dias: verificar encaminhamento ao INSS' });
  }
  return { valid: errors.length === 0, errors, warnings };
}

export function validarS2299(dados: Record<string, any>): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  required(dados.cpfTrab, 'cpfTrab', errors);
  cpfValido(dados.cpfTrab, 'cpfTrab', errors);
  required(dados.dtDeslig, 'dtDeslig', errors);
  dataValida(dados.dtDeslig, 'dtDeslig', errors);
  required(dados.mtvDeslig, 'mtvDeslig', errors);
  const motivosDeslig = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48'];
  if (dados.mtvDeslig && !motivosDeslig.includes(dados.mtvDeslig)) {
    errors.push({ campo: 'mtvDeslig', mensagem: 'Motivo de desligamento inválido', regra: 'REGRA_MOTIVO_DESLIG' });
  }
  required(dados.dtAvPrv, 'dtAvPrv', errors);
  if (dados.indPagtoAPI) enumValido(dados.indPagtoAPI?.toString(), ['1','2','3'], 'indPagtoAPI', errors);
  if (dados.verbasResc) {
    for (let i = 0; i < dados.verbasResc.length; i++) {
      required(dados.verbasResc[i].codRubr, `verbasResc[${i}].codRubr`, errors);
      required(dados.verbasResc[i].vrRubr, `verbasResc[${i}].vrRubr`, errors);
    }
  }
  if (['02','07'].includes(dados.mtvDeslig)) {
    warnings.push({ campo: 'mtvDeslig', mensagem: 'Desligamento sem justa causa: verificar multa FGTS 40%' });
  }
  return { valid: errors.length === 0, errors, warnings };
}

export function validarS2300(dados: Record<string, any>): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  required(dados.cpfTrab, 'cpfTrab', errors);
  cpfValido(dados.cpfTrab, 'cpfTrab', errors);
  required(dados.nmTrab, 'nmTrab', errors);
  maxLen(dados.nmTrab, 70, 'nmTrab', errors);
  required(dados.dtNascto, 'dtNascto', errors);
  dataValida(dados.dtNascto, 'dtNascto', errors);
  required(dados.dtInicio, 'dtInicio', errors);
  dataValida(dados.dtInicio, 'dtInicio', errors);
  required(dados.codCateg, 'codCateg', errors);
  const catTSV = ['201','202','301','302','303','304','305','306','307','308','309','310','311','312','313','401','410','701','702','703','711','712','721','722','723','731','734','738','741','751','761','771','781','901','902','903','904'];
  if (dados.codCateg && !catTSV.includes(dados.codCateg)) {
    errors.push({ campo: 'codCateg', mensagem: 'Categoria TSV inválida', regra: 'REGRA_CATEGORIA_TSV' });
  }
  return { valid: errors.length === 0, errors, warnings };
}

export function validarS3000(dados: Record<string, any>): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  required(dados.tpEvento, 'tpEvento', errors);
  required(dados.nrRecEvt, 'nrRecEvt', errors);
  maxLen(dados.nrRecEvt, 40, 'nrRecEvt', errors);
  const eventosExcluiveis = ['S-1200','S-1210','S-1260','S-1270','S-1280','S-2190','S-2200','S-2205','S-2206','S-2230','S-2299','S-2300','S-2399'];
  if (dados.tpEvento && !eventosExcluiveis.includes(dados.tpEvento)) {
    errors.push({ campo: 'tpEvento', mensagem: 'Tipo de evento não suporta exclusão via S-3000', regra: 'REGRA_EVENTO_EXCLUSAO' });
  }
  if (dados.perApur) {
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(dados.perApur)) {
      errors.push({ campo: 'perApur', mensagem: 'Período de apuração inválido', regra: 'REGRA_PERIODO' });
    }
  }
  warnings.push({ campo: 'tpEvento', mensagem: 'Exclusão é irreversível: confirme os dados antes de enviar' });
  return { valid: errors.length === 0, errors, warnings };
}
