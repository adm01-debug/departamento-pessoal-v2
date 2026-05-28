import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresa } from '@/contexts';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

interface ImportRow {
  nome_completo: string;
  cpf: string;
  email?: string;
  telefone?: string;
  cargo?: string;
  departamento?: string;
  salario_base?: number;
  data_admissao?: string;
  data_nascimento?: string;
  pis?: string;
  rg?: string;
  status: 'valido' | 'erro' | 'duplicado';
  erros: string[];
}

const COLUMN_MAP: Record<string, string> = {
  'nome': 'nome_completo', 'nome completo': 'nome_completo', 'nome_completo': 'nome_completo', 'colaborador': 'nome_completo',
  'cpf': 'cpf', 'cpf_cnpj': 'cpf',
  'email': 'email', 'e-mail': 'email', 'e_mail': 'email',
  'telefone': 'telefone', 'celular': 'telefone', 'fone': 'telefone', 'tel': 'telefone',
  'cargo': 'cargo', 'funcao': 'cargo', 'função': 'cargo',
  'departamento': 'departamento', 'depto': 'departamento', 'setor': 'departamento',
  'salario': 'salario_base', 'salário': 'salario_base', 'salario_base': 'salario_base', 'remuneracao': 'salario_base',
  'admissao': 'data_admissao', 'data_admissao': 'data_admissao', 'data admissão': 'data_admissao', 'data de admissão': 'data_admissao',
  'nascimento': 'data_nascimento', 'data_nascimento': 'data_nascimento', 'data nascimento': 'data_nascimento',
  'pis': 'pis', 'pis_pasep': 'pis', 'nit': 'pis',
  'rg': 'rg', 'identidade': 'rg',
};

export function useImportacaoColaboradores() {
  const { empresaAtual } = useEmpresa();
  const queryClient = useQueryClient();
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [progress, setProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);

  const validarCPF = (cpf: string): boolean => {
    const clean = cpf.replace(/\D/g, '');
    if (clean.length !== 11 || /^(\d)\1{10}$/.test(clean)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(clean[i]) * (10 - i);
    let rest = (sum * 10) % 11;
    if (rest === 10) rest = 0;
    if (rest !== parseInt(clean[9])) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(clean[i]) * (11 - i);
    rest = (sum * 10) % 11;
    if (rest === 10) rest = 0;
    return rest === parseInt(clean[10]);
  };

  const normalizarCPF = (cpf: string): string => {
    return cpf?.toString().replace(/\D/g, '').padStart(11, '0') || '';
  };

  const parseDate = (val: any): string | null => {
    if (!val) return null;
    if (typeof val === 'number') {
      const d = new Date((val - 25569) * 86400 * 1000);
      return d.toISOString().split('T')[0];
    }
    const parts = String(val).match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (parts) return `${parts[3]}-${parts[2]}-${parts[1]}`;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
  };

  const processarArquivo = useCallback(async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawData = XLSX.utils.sheet_to_json<unknown>(sheet, { header: 1 });

      if (rawData.length < 2) throw new Error('Planilha vazia');

      const headers = rawData[0] as string[];
      const colMap: Record<number, string> = {};
      headers.forEach((h, i) => {
        const normalized = h.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (COLUMN_MAP[normalized]) colMap[i] = COLUMN_MAP[normalized];
      });

      if (!Object.values(colMap).includes('nome_completo')) {
        throw new Error('Coluna "Nome" não encontrada');
      }

      const { data: existingCols } = await supabase.from('colaboradores').select('cpf').eq('empresa_id', empresaAtual?.id || '');
      const existingCPFs = new Set((existingCols || []).map((c: any) => normalizarCPF(c.cpf)));

      const parsed: ImportRow[] = [];
      for (let i = 1; i < rawData.length; i++) {
        const row = rawData[i] as any[];
        if (!row || row.every(c => !c)) continue;

        const item: any = {};
        Object.entries(colMap).forEach(([colIdx, field]) => {
          item[field] = row[Number(colIdx)]?.toString()?.trim() || '';
        });

        const erros: string[] = [];
        if (!item.nome_completo) erros.push('Nome obrigatório');

        const cpfClean = normalizarCPF(item.cpf || '');
        if (cpfClean && !validarCPF(cpfClean)) erros.push('CPF inválido');

        const isDuplicate = cpfClean && existingCPFs.has(cpfClean);
        if (isDuplicate) erros.push('CPF já cadastrado');

        item.data_admissao = parseDate(item.data_admissao);
        item.data_nascimento = parseDate(item.data_nascimento);
        if (item.salario_base) item.salario_base = Number(String(item.salario_base).replace(/[^\d.,]/g, '').replace(',', '.'));

        parsed.push({
          ...item,
          cpf: cpfClean,
          status: isDuplicate ? 'duplicado' : erros.length > 0 ? 'erro' : 'valido',
          erros,
        });
      }

      setRows(parsed);
      return parsed;
    } catch (err: any) {
      toast.error(err.message);
      throw err;
    }
  }, [empresaAtual]);

  const importar = async () => {
    const validos = rows.filter(r => r.status === 'valido');
    if (!validos.length) return;

    setIsImporting(true);
    let successCount = 0;

    for (let i = 0; i < validos.length; i++) {
      const row = validos[i];
      try {
        const { error } = await supabase.from('colaboradores').insert({
          ...row,
          empresa_id: empresaAtual?.id,
          status: 'ativo',
          erros: undefined,
        } as any);
        if (error) throw error;
        successCount++;
      } catch (err) {
        console.error(err);
      }
      setProgress(Math.round(((i + 1) / validos.length) * 100));
    }

    setIsImporting(false);
    queryClient.invalidateQueries({ queryKey: ['colaboradores'] });
    toast.success(`${successCount} colaboradores importados`);
  };

  return { rows, progress, isImporting, processarArquivo, importar, setRows };
}
