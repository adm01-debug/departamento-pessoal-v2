/**
 * Validadores eSocial — Eventos Periódicos (S-1xxx)
 */
import { ValidationResult, ValidationError, ValidationWarning, required, maxLen, cpfValido, cnpjValido, enumValido, dataValida, ESocialData } from './helpers';

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

export function validarS1270(dados: Record<string, any>): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  required(dados.perApur, 'perApur', errors);
  required(dados.nrInsc, 'nrInsc', errors);
  required(dados.codLotacao, 'codLotacao', errors);
  return { valid: errors.length === 0, errors, warnings };
}

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
