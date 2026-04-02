/**
 * Validadores eSocial - Eventos S-1000 a S-3000
 * Conformidade com layout 1.2 / simplificação S-1.0
 */

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  campo: string;
  mensagem: string;
  regra: string;
}

export interface ValidationWarning {
  campo: string;
  mensagem: string;
}

// ========== HELPERS ==========
function required(val: any, campo: string, errors: ValidationError[]) {
  if (val === null || val === undefined || val === '') {
    errors.push({ campo, mensagem: `${campo} é obrigatório`, regra: 'REGRA_OBRIGATORIO' });
  }
}

function maxLen(val: string | null | undefined, max: number, campo: string, errors: ValidationError[]) {
  if (val && val.length > max) {
    errors.push({ campo, mensagem: `${campo} excede ${max} caracteres`, regra: 'REGRA_TAMANHO_MAX' });
  }
}

function cpfValido(cpf: string | null | undefined, campo: string, errors: ValidationError[]) {
  if (!cpf) return;
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11 || /^(\d)\1+$/.test(clean)) {
    errors.push({ campo, mensagem: 'CPF inválido', regra: 'REGRA_CPF' });
    return;
  }
  let s = 0;
  for (let i = 0; i < 9; i++) s += parseInt(clean[i]) * (10 - i);
  let d = 11 - (s % 11); if (d >= 10) d = 0;
  if (parseInt(clean[9]) !== d) { errors.push({ campo, mensagem: 'CPF inválido', regra: 'REGRA_CPF' }); return; }
  s = 0;
  for (let i = 0; i < 10; i++) s += parseInt(clean[i]) * (11 - i);
  d = 11 - (s % 11); if (d >= 10) d = 0;
  if (parseInt(clean[10]) !== d) errors.push({ campo, mensagem: 'CPF inválido', regra: 'REGRA_CPF' });
}

function cnpjValido(cnpj: string | null | undefined, campo: string, errors: ValidationError[]) {
  if (!cnpj) return;
  const clean = cnpj.replace(/\D/g, '');
  if (clean.length !== 14 || /^(\d)\1+$/.test(clean)) {
    errors.push({ campo, mensagem: 'CNPJ inválido', regra: 'REGRA_CNPJ' });
    return;
  }
  const pesos1 = [5,4,3,2,9,8,7,6,5,4,3,2];
  const pesos2 = [6,5,4,3,2,9,8,7,6,5,4,3,2];
  let s = 0;
  for (let i = 0; i < 12; i++) s += parseInt(clean[i]) * pesos1[i];
  let d = s % 11 < 2 ? 0 : 11 - (s % 11);
  if (parseInt(clean[12]) !== d) { errors.push({ campo, mensagem: 'CNPJ inválido', regra: 'REGRA_CNPJ' }); return; }
  s = 0;
  for (let i = 0; i < 13; i++) s += parseInt(clean[i]) * pesos2[i];
  d = s % 11 < 2 ? 0 : 11 - (s % 11);
  if (parseInt(clean[13]) !== d) errors.push({ campo, mensagem: 'CNPJ inválido', regra: 'REGRA_CNPJ' });
}

function dataValida(val: string | null | undefined, campo: string, errors: ValidationError[]) {
  if (!val) return;
  const d = new Date(val);
  if (isNaN(d.getTime())) errors.push({ campo, mensagem: 'Data inválida', regra: 'REGRA_DATA' });
}

function enumValido(val: string | null | undefined, opcoes: string[], campo: string, errors: ValidationError[]) {
  if (val && !opcoes.includes(val)) {
    errors.push({ campo, mensagem: `Valor '${val}' não permitido. Opções: ${opcoes.join(', ')}`, regra: 'REGRA_ENUM' });
  }
}

// ========== S-1000 - Empregador ==========
export function validarS1000(dados: Record<string, any>): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  required(dados.tpInsc, 'tpInsc', errors);
  enumValido(dados.tpInsc?.toString(), ['1', '2', '3', '4'], 'tpInsc', errors);
  required(dados.nrInsc, 'nrInsc', errors);
  if (dados.tpInsc === 1) cnpjValido(dados.nrInsc, 'nrInsc', errors);
  if (dados.tpInsc === 2) cpfValido(dados.nrInsc, 'nrInsc', errors);
  required(dados.nmRazao, 'nmRazao', errors);
  maxLen(dados.nmRazao, 115, 'nmRazao', errors);
  required(dados.classTrib, 'classTrib', errors);
  required(dados.natJurid, 'natJurid', errors);
  required(dados.indCoop, 'indCoop', errors);
  enumValido(dados.indCoop?.toString(), ['0', '1', '2', '3'], 'indCoop', errors);
  required(dados.indConstr, 'indConstr', errors);
  enumValido(dados.indConstr?.toString(), ['0', '1'], 'indConstr', errors);
  required(dados.indDesFolha, 'indDesFolha', errors);
  enumValido(dados.indDesFolha?.toString(), ['0', '1'], 'indDesFolha', errors);
  required(dados.indOptRegEletron, 'indOptRegEletron', errors);
  required(dados.iniValid, 'iniValid', errors);

  if (!dados.contato?.nmCtt) warnings.push({ campo: 'contato.nmCtt', mensagem: 'Contato recomendado' });

  return { valid: errors.length === 0, errors, warnings };
}

// ========== S-1005 - Estabelecimentos ==========
export function validarS1005(dados: Record<string, any>): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  required(dados.tpInsc, 'tpInsc', errors);
  required(dados.nrInsc, 'nrInsc', errors);
  required(dados.iniValid, 'iniValid', errors);
  if (dados.tpInsc === 1) cnpjValido(dados.nrInsc, 'nrInsc', errors);
  required(dados.cnaePrep, 'cnaePrep', errors);
  if (dados.cnaePrep && !/^\d{7}$/.test(dados.cnaePrep)) {
    errors.push({ campo: 'cnaePrep', mensagem: 'CNAE deve ter 7 dígitos', regra: 'REGRA_CNAE' });
  }
  required(dados.aliqRat, 'aliqRat', errors);
  enumValido(dados.aliqRat?.toString(), ['1', '2', '3'], 'aliqRat', errors);
  if (dados.fap !== undefined && (dados.fap < 0.5 || dados.fap > 2.0)) {
    errors.push({ campo: 'fap', mensagem: 'FAP deve estar entre 0.50 e 2.00', regra: 'REGRA_FAP' });
  }

  return { valid: errors.length === 0, errors, warnings };
}

// ========== S-1010 - Rubricas ==========
export function validarS1010(dados: Record<string, any>): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  required(dados.codRubr, 'codRubr', errors);
  maxLen(dados.codRubr, 30, 'codRubr', errors);
  required(dados.ideTabRubr, 'ideTabRubr', errors);
  required(dados.iniValid, 'iniValid', errors);
  required(dados.dscRubr, 'dscRubr', errors);
  maxLen(dados.dscRubr, 100, 'dscRubr', errors);
  required(dados.natRubr, 'natRubr', errors);
  required(dados.tpRubr, 'tpRubr', errors);
  enumValido(dados.tpRubr?.toString(), ['1', '2', '3', '4'], 'tpRubr', errors);
  required(dados.codIncCP, 'codIncCP', errors);
  required(dados.codIncIRRF, 'codIncIRRF', errors);
  required(dados.codIncFGTS, 'codIncFGTS', errors);

  return { valid: errors.length === 0, errors, warnings };
}

// ========== S-1020 - Lotações Tributárias ==========
export function validarS1020(dados: Record<string, any>): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  required(dados.codLotacao, 'codLotacao', errors);
  maxLen(dados.codLotacao, 30, 'codLotacao', errors);
  required(dados.iniValid, 'iniValid', errors);
  required(dados.tpLotacao, 'tpLotacao', errors);
  if (dados.tpLotacao && !['01','02','03','04','05','06','07','08','09','10','21','22','23','24','25','61','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','90','91','92','99'].includes(dados.tpLotacao)) {
    errors.push({ campo: 'tpLotacao', mensagem: 'Tipo de lotação inválido', regra: 'REGRA_ENUM' });
  }

  return { valid: errors.length === 0, errors, warnings };
}

// ========== S-1070 - Processos Administrativos ==========
export function validarS1070(dados: Record<string, any>): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  required(dados.tpProc, 'tpProc', errors);
  enumValido(dados.tpProc?.toString(), ['1', '2', '3', '4'], 'tpProc', errors);
  required(dados.nrProc, 'nrProc', errors);
  maxLen(dados.nrProc, 21, 'nrProc', errors);
  required(dados.iniValid, 'iniValid', errors);
  required(dados.indAutoria, 'indAutoria', errors);
  enumValido(dados.indAutoria?.toString(), ['1', '2'], 'indAutoria', errors);

  return { valid: errors.length === 0, errors, warnings };
}

// ========== S-1200 - Remuneração ==========
export function validarS1200(dados: Record<string, any>): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  required(dados.perApur, 'perApur', errors);
  if (dados.perApur && !/^\d{4}-(0[1-9]|1[0-2])$/.test(dados.perApur)) {
    errors.push({ campo: 'perApur', mensagem: 'Período deve estar no formato AAAA-MM', regra: 'REGRA_PERIODO' });
  }
  required(dados.cpfTrab, 'cpfTrab', errors);
  cpfValido(dados.cpfTrab, 'cpfTrab', errors);

  if (dados.dmDev) {
    for (let i = 0; i < dados.dmDev.length; i++) {
      const dm = dados.dmDev[i];
      required(dm.ideDmDev, `dmDev[${i}].ideDmDev`, errors);
      if (dm.infoPerApur?.ideEstabLot) {
        for (const estab of dm.infoPerApur.ideEstabLot) {
          required(estab.codLotacao, `dmDev[${i}].codLotacao`, errors);
          if (estab.detVerbas) {
            for (const verba of estab.detVerbas) {
              required(verba.codRubr, `verba.codRubr`, errors);
              required(verba.vrRubr, `verba.vrRubr`, errors);
              if (verba.vrRubr !== undefined && verba.vrRubr < 0) {
                errors.push({ campo: 'vrRubr', mensagem: 'Valor da rubrica não pode ser negativo', regra: 'REGRA_VALOR' });
              }
            }
          }
        }
      }
    }
  } else {
    errors.push({ campo: 'dmDev', mensagem: 'Demonstrativo obrigatório', regra: 'REGRA_OBRIGATORIO' });
  }

  return { valid: errors.length === 0, errors, warnings };
}

// ========== S-1210 - Pagamentos ==========
export function validarS1210(dados: Record<string, any>): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  required(dados.perApur, 'perApur', errors);
  required(dados.cpfTrab, 'cpfTrab', errors);
  cpfValido(dados.cpfTrab, 'cpfTrab', errors);

  if (dados.infoPgto) {
    for (let i = 0; i < dados.infoPgto.length; i++) {
      const pgto = dados.infoPgto[i];
      required(pgto.dtPgto, `infoPgto[${i}].dtPgto`, errors);
      dataValida(pgto.dtPgto, `infoPgto[${i}].dtPgto`, errors);
      required(pgto.tpPgto, `infoPgto[${i}].tpPgto`, errors);
      enumValido(pgto.tpPgto?.toString(), ['1', '2', '3', '4', '5', '6', '9'], `infoPgto[${i}].tpPgto`, errors);
    }
  } else {
    errors.push({ campo: 'infoPgto', mensagem: 'Informação de pagamento obrigatória', regra: 'REGRA_OBRIGATORIO' });
  }

  return { valid: errors.length === 0, errors, warnings };
}

// ========== S-1260 - Comercialização Produção ==========
export function validarS1260(dados: Record<string, any>): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  required(dados.perApur, 'perApur', errors);
  required(dados.nrInsc, 'nrInsc', errors);
  required(dados.indComerc, 'indComerc', errors);
  enumValido(dados.indComerc?.toString(), ['2', '3', '7', '8', '9'], 'indComerc', errors);
  required(dados.vrTotCom, 'vrTotCom', errors);

  return { valid: errors.length === 0, errors, warnings };
}

// ========== S-1270 - Contratação Avulsos ==========
export function validarS1270(dados: Record<string, any>): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  required(dados.perApur, 'perApur', errors);
  required(dados.nrInsc, 'nrInsc', errors);
  required(dados.codLotacao, 'codLotacao', errors);

  return { valid: errors.length === 0, errors, warnings };
}

// ========== S-1280 - Informações Complementares ==========
export function validarS1280(dados: Record<string, any>): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  required(dados.perApur, 'perApur', errors);
  required(dados.indSubstPatr, 'indSubstPatr', errors);
  enumValido(dados.indSubstPatr?.toString(), ['1', '2'], 'indSubstPatr', errors);
  if (dados.percRedContrib !== undefined) {
    if (dados.percRedContrib < 0 || dados.percRedContrib > 100) {
      errors.push({ campo: 'percRedContrib', mensagem: 'Percentual deve estar entre 0 e 100', regra: 'REGRA_PERCENTUAL' });
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

// ========== S-2190 - Admissão Preliminar ==========
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

// ========== S-2205 - Alteração Cadastral ==========
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

// ========== S-2206 - Alteração Contratual ==========
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

// ========== S-2230 - Afastamento Temporário ==========
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

  // Afastamentos por doença > 15 dias precisam de info INSS
  if (['01','03'].includes(dados.codMotAfast) && dados.dtIniAfast && dados.dtTermAfast) {
    const dias = Math.ceil((new Date(dados.dtTermAfast).getTime() - new Date(dados.dtIniAfast).getTime()) / (24*60*60*1000));
    if (dias > 15) warnings.push({ campo: 'codMotAfast', mensagem: 'Afastamento > 15 dias: verificar encaminhamento ao INSS' });
  }

  return { valid: errors.length === 0, errors, warnings };
}

// ========== S-2299 - Desligamento ==========
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

  // Rescisão com verbas
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

// ========== S-2300 - TSV Início ==========
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

// ========== S-3000 - Exclusão de Eventos ==========
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

// ========== Validador Universal ==========
const validadores: Record<string, (dados: Record<string, any>) => ValidationResult> = {
  'S-1000': validarS1000,
  'S-1005': validarS1005,
  'S-1010': validarS1010,
  'S-1020': validarS1020,
  'S-1070': validarS1070,
  'S-1200': validarS1200,
  'S-1210': validarS1210,
  'S-1260': validarS1260,
  'S-1270': validarS1270,
  'S-1280': validarS1280,
  'S-2190': validarS2190,
  'S-2205': validarS2205,
  'S-2206': validarS2206,
  'S-2230': validarS2230,
  'S-2299': validarS2299,
  'S-2300': validarS2300,
  'S-3000': validarS3000,
};

export function validarEvento(tipo: string, dados: Record<string, any>): ValidationResult {
  const fn = validadores[tipo];
  if (!fn) {
    return { valid: false, errors: [{ campo: 'tpEvento', mensagem: `Validador não encontrado para ${tipo}`, regra: 'REGRA_TIPO_EVENTO' }], warnings: [] };
  }
  return fn(dados);
}

export function getValidadoresDisponiveis(): string[] {
  return Object.keys(validadores);
}
