/**
 * @fileoverview Hook para importação de colaboradores
 * @module hooks/useImportacaoColaboradores
 */
import { logger } from '@/lib/logger';
import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { validateCPF, validatePIS, unmask } from '@/lib/masks';
import { parse, isValid, format } from 'date-fns';

export interface ColaboradorImport {
  nome_completo?: string;
  cpf?: string;
  cargo?: string;
  departamento?: string;
  data_admissao?: string;
  [key: string]: unknown;
}

export interface ColaboradorImportRow {
  linha: number;
  dados: ColaboradorImport;
  erros: string[];
  valido: boolean;
}

export interface ImportResult {
  total: number;
  sucesso: number;
  erros: number;
  detalhes: { linha: number; erro: string }[];
}

// Mapeamento de colunas da planilha para campos do banco
const COLUMN_MAPPING: Record<string, string> = {
  'nome': 'nome_completo',
  'nome_completo': 'nome_completo',
  'nome completo': 'nome_completo',
  'cpf': 'cpf',
  'rg': 'rg',
  'data_nascimento': 'data_nascimento',
  'data nascimento': 'data_nascimento',
  'nascimento': 'data_nascimento',
  'sexo': 'sexo',
  'genero': 'sexo',
  'gênero': 'sexo',
  'estado_civil': 'estado_civil',
  'estado civil': 'estado_civil',
  'nome_mae': 'nome_mae',
  'nome mae': 'nome_mae',
  'nome da mae': 'nome_mae',
  'nome da mãe': 'nome_mae',
  'mae': 'nome_mae',
  'mãe': 'nome_mae',
  'email': 'email',
  'e-mail': 'email',
  'telefone': 'telefone',
  'celular': 'celular',
  'cep': 'cep',
  'logradouro': 'logradouro',
  'endereco': 'logradouro',
  'endereço': 'logradouro',
  'numero': 'numero',
  'número': 'numero',
  'bairro': 'bairro',
  'cidade': 'cidade',
  'uf': 'uf',
  'estado': 'uf',
  'cargo': 'cargo',
  'funcao': 'cargo',
  'função': 'cargo',
  'departamento': 'departamento',
  'setor': 'departamento',
  'data_admissao': 'data_admissao',
  'data admissao': 'data_admissao',
  'data admissão': 'data_admissao',
  'admissao': 'data_admissao',
  'admissão': 'data_admissao',
  'salario': 'salario_base',
  'salário': 'salario_base',
  'salario_base': 'salario_base',
  'salário base': 'salario_base',
  'tipo_contrato': 'tipo_contrato',
  'tipo contrato': 'tipo_contrato',
  'contrato': 'tipo_contrato',
  'pis': 'pis_pasep',
  'pis_pasep': 'pis_pasep',
  'matricula': 'matricula',
  'matrícula': 'matricula',
};

const SEXO_MAP: Record<string, string> = {
  'm': 'masculino',
  'masculino': 'masculino',
  'masc': 'masculino',
  'f': 'feminino',
  'feminino': 'feminino',
  'fem': 'feminino',
};

const ESTADO_CIVIL_MAP: Record<string, string> = {
  'solteiro': 'solteiro',
  'solteira': 'solteiro',
  's': 'solteiro',
  'casado': 'casado',
  'casada': 'casado',
  'c': 'casado',
  'divorciado': 'divorciado',
  'divorciada': 'divorciado',
  'd': 'divorciado',
  'viuvo': 'viuvo',
  'viúvo': 'viuvo',
  'viuva': 'viuvo',
  'viúva': 'viuvo',
  'v': 'viuvo',
  'separado': 'separado',
  'separada': 'separado',
  'uniao estavel': 'uniao_estavel',
  'união estável': 'uniao_estavel',
  'uniao_estavel': 'uniao_estavel',
};

const TIPO_CONTRATO_MAP: Record<string, string> = {
  'clt': 'clt',
  'pj': 'pj',
  'estagiario': 'estagiario',
  'estagiária': 'estagiario',
  'estágio': 'estagiario',
  'temporario': 'temporario',
  'temporário': 'temporario',
  'intermitente': 'intermitente',
  'aprendiz': 'aprendiz',
  'jovem aprendiz': 'aprendiz',
};

function normalizeColumnName(name: string): string {
  return name.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function parseDate(value: unknown): string | null {
  if (!value) return null;
  
  // Se for número (Excel date serial)
  if (typeof value === 'number') {
    const date = XLSX.SSF.parse_date_code(value);
    if (date) {
      return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
    }
  }
  
  // Se for string
  if (typeof value === 'string') {
    // Tentar formatos comuns
    const formats = ['dd/MM/yyyy', 'dd-MM-yyyy', 'yyyy-MM-dd', 'd/M/yyyy'];
    for (const fmt of formats) {
      const parsed = parse(value, fmt, new Date());
      if (isValid(parsed)) {
        return format(parsed, 'yyyy-MM-dd');
      }
    }
  }
  
  // Se for Date
  if (value instanceof Date && isValid(value)) {
    return format(value, 'yyyy-MM-dd');
  }
  
  return null;
}

function parseCurrency(value: unknown): number {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  
  const str = String(value)
    .replace(/[R$\s]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  
  return parseFloat(str) || 0;
}

export interface UseImportacaoColaboradoresReturn {
  arquivo: File | null;
  dadosPreview: ColaboradorImportRow[];
  colunasDetectadas: string[];
  processando: boolean;
  importando: boolean;
  resultado: ImportResult | null;
  processarArquivo: (file: File) => Promise<void>;
  importarColaboradores: () => Promise<ImportResult | undefined>;
  limpar: () => void;
  totalValidos: number;
  totalInvalidos: number;
}

export function useImportacaoColaboradores(): UseImportacaoColaboradoresReturn {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [dadosPreview, setDadosPreview] = useState<ColaboradorImportRow[]>([]);
  const [colunasDetectadas, setColunasDetectadas] = useState<string[]>([]);
  const [processando, setProcessando] = useState(false);
  const [importando, setImportando] = useState(false);
  const [resultado, setResultado] = useState<ImportResult | null>(null);

  const processarArquivo = useCallback(async (file: File) => {
    setProcessando(true);
    setArquivo(file);
    setResultado(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array', cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][];

      if (jsonData.length < 2) {
        toast({
          title: 'Arquivo vazio',
          description: 'O arquivo não contém dados para importar.',
          variant: 'destructive',
        });
        setProcessando(false);
        return;
      }

      // Primeira linha são os cabeçalhos
      const headers = (jsonData[0] as string[]).map(h => String(h ?? '').trim());
      setColunasDetectadas(headers);

      // Mapear colunas
      const columnIndexMap: Record<string, number> = {};
      headers.forEach((header, index) => {
        const normalized = normalizeColumnName(header);
        const mappedField = COLUMN_MAPPING[normalized];
        if (mappedField) {
          columnIndexMap[mappedField] = index;
        }
      });

      // Verificar campos obrigatórios
      const camposObrigatorios = ['nome_completo', 'cpf', 'cargo', 'departamento', 'data_admissao', 'salario_base', 'nome_mae'];
      const camposFaltando = camposObrigatorios.filter(campo => columnIndexMap[campo] === undefined);

      if (camposFaltando.length > 0) {
        toast({
          title: 'Colunas obrigatórias não encontradas',
          description: `Faltam as colunas: ${camposFaltando.join(', ')}`,
          variant: 'destructive',
        });
      }

      // Buscar CPFs existentes para verificar duplicados
      const { data: cpfsExistentes } = await supabase
        .from('colaboradores')
        .select('cpf');
      
      const cpfsSet = new Set((cpfsExistentes ?? []).map(c => unmask(c.cpf)));

      // Processar linhas
      const previews: ColaboradorImportRow[] = [];
      
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row || row.every(cell => cell === null || cell === undefined || cell === '')) continue;

        const erros: string[] = [];
        const dados: ColaboradorImport = {};

        // Extrair dados mapeados
        Object.entries(columnIndexMap).forEach(([field, index]) => {
          dados[field] = row[index];
        });

        // Validar e transformar dados
        // Nome completo
        if (!dados.nome_completo || String(dados.nome_completo).trim().length < 3) {
          erros.push('Nome completo é obrigatório (mínimo 3 caracteres)');
        } else {
          dados.nome_completo = String(dados.nome_completo).trim();
        }

        // CPF
        const cpfLimpo = unmask(String(dados.cpf ?? ''));
        if (!cpfLimpo || cpfLimpo.length !== 11) {
          erros.push('CPF inválido (deve ter 11 dígitos)');
        } else if (!validateCPF(cpfLimpo)) {
          erros.push('CPF com dígito verificador inválido');
        } else if (cpfsSet.has(cpfLimpo)) {
          erros.push('CPF já cadastrado no sistema');
        }
        dados.cpf = cpfLimpo;

        // Data de nascimento
        const dataNasc = parseDate(dados.data_nascimento);
        if (!dataNasc) {
          erros.push('Data de nascimento inválida');
        }
        dados.data_nascimento = dataNasc ?? undefined;

        // Data de admissão
        const dataAdm = parseDate(dados.data_admissao);
        if (!dataAdm) {
          erros.push('Data de admissão é obrigatória');
        }
        dados.data_admissao = dataAdm ?? undefined;

        // Sexo
        const sexoNorm = normalizeColumnName(String(dados.sexo ?? ''));
        dados.sexo = SEXO_MAP[sexoNorm] || 'masculino';

        // Estado civil
        const estadoCivilNorm = normalizeColumnName(String(dados.estado_civil ?? ''));
        dados.estado_civil = ESTADO_CIVIL_MAP[estadoCivilNorm] || 'solteiro';

        // Tipo contrato
        const tipoContratoNorm = normalizeColumnName(String(dados.tipo_contrato ?? ''));
        dados.tipo_contrato = TIPO_CONTRATO_MAP[tipoContratoNorm] || 'clt';

        // Salário
        dados.salario_base = parseCurrency(dados.salario_base);
        if ((dados.salario_base as number) <= 0) {
          erros.push('Salário deve ser maior que zero');
        }

        // Cargo
        if (!dados.cargo || String(dados.cargo).trim().length < 2) {
          erros.push('Cargo é obrigatório');
        } else {
          dados.cargo = String(dados.cargo).trim();
        }

        // Departamento
        if (!dados.departamento || String(dados.departamento).trim().length < 2) {
          erros.push('Departamento é obrigatório');
        } else {
          dados.departamento = String(dados.departamento).trim();
        }

        // Nome da mãe
        if (!dados.nome_mae || String(dados.nome_mae).trim().length < 3) {
          erros.push('Nome da mãe é obrigatório');
        } else {
          dados.nome_mae = String(dados.nome_mae).trim();
        }

        // PIS (opcional mas validar se preenchido)
        if (dados.pis_pasep) {
          const pisLimpo = unmask(String(dados.pis_pasep));
          if (pisLimpo.length > 0 && !validatePIS(pisLimpo)) {
            erros.push('PIS/PASEP inválido');
          }
          dados.pis_pasep = pisLimpo || undefined;
        }

        // Campos de texto opcionais
        ['email', 'telefone', 'celular', 'cep', 'logradouro', 'numero', 'bairro', 'cidade', 'uf', 'rg', 'matricula']
          .forEach(field => {
            if (dados[field]) {
              dados[field] = String(dados[field]).trim();
            } else {
              dados[field] = undefined;
            }
          });

        previews.push({
          linha: i + 1,
          dados,
          erros,
          valido: erros.length === 0,
        });

        // Adicionar CPF ao set para detectar duplicados na própria planilha
        if (cpfLimpo && cpfLimpo.length === 11) {
          cpfsSet.add(cpfLimpo);
        }
      }

      setDadosPreview(previews);
      
      const validos = previews.filter(p => p.valido).length;
      const invalidos = previews.filter(p => !p.valido).length;
      
      toast({
        title: 'Arquivo processado',
        description: `${validos} registros válidos, ${invalidos} com erros.`,
      });

    } catch (error) {
      logger.error('Erro ao processar arquivo:', error);
      toast({
        title: 'Erro ao processar arquivo',
        description: 'Verifique se o arquivo é um Excel ou CSV válido.',
        variant: 'destructive',
      });
    } finally {
      setProcessando(false);
    }
  }, []);

  const importarColaboradores = useCallback(async (): Promise<ImportResult | undefined> => {
    const validos = dadosPreview.filter(p => p.valido);
    
    if (validos.length === 0) {
      toast({
        title: 'Nenhum registro válido',
        description: 'Corrija os erros antes de importar.',
        variant: 'destructive',
      });
      return;
    }

    setImportando(true);
    const detalhesErros: { linha: number; erro: string }[] = [];
    let sucesso = 0;

    for (const item of validos) {
      try {
        const { error } = await supabase.from('colaboradores').insert({
          nome_completo: item.dados.nome_completo,
          cpf: item.dados.cpf,
          rg: item.dados.rg,
          data_nascimento: item.dados.data_nascimento,
          sexo: item.dados.sexo,
          estado_civil: item.dados.estado_civil,
          nome_mae: item.dados.nome_mae,
          email: item.dados.email,
          telefone: item.dados.telefone,
          celular: item.dados.celular,
          cep: item.dados.cep,
          logradouro: item.dados.logradouro,
          numero: item.dados.numero,
          bairro: item.dados.bairro,
          cidade: item.dados.cidade,
          uf: item.dados.uf,
          cargo: item.dados.cargo,
          departamento: item.dados.departamento,
          data_admissao: item.dados.data_admissao,
          salario_base: item.dados.salario_base,
          tipo_contrato: item.dados.tipo_contrato,
          pis_pasep: item.dados.pis_pasep,
          matricula: item.dados.matricula,
          status: 'ativo',
        });

        if (error) {
          detalhesErros.push({ linha: item.linha, erro: error.message });
        } else {
          sucesso++;
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        detalhesErros.push({ linha: item.linha, erro: errorMessage });
      }
    }

    const result: ImportResult = {
      total: validos.length,
      sucesso,
      erros: detalhesErros.length,
      detalhes: detalhesErros,
    };

    setResultado(result);
    setImportando(false);

    if (sucesso > 0) {
      toast({
        title: 'Importação concluída',
        description: `${sucesso} colaboradores importados com sucesso.`,
      });
    }

    if (detalhesErros.length > 0) {
      toast({
        title: 'Erros na importação',
        description: `${detalhesErros.length} registros com erro.`,
        variant: 'destructive',
      });
    }

    return result;
  }, [dadosPreview]);

  const limpar = useCallback(() => {
    setArquivo(null);
    setDadosPreview([]);
    setColunasDetectadas([]);
    setResultado(null);
  }, []);

  return {
    arquivo,
    dadosPreview,
    colunasDetectadas,
    processando,
    importando,
    resultado,
    processarArquivo,
    importarColaboradores,
    limpar,
    totalValidos: dadosPreview.filter(p => p.valido).length,
    totalInvalidos: dadosPreview.filter(p => !p.valido).length,
  };
}
