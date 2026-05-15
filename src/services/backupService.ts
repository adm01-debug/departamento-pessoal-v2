import { supabase } from '@/integrations/supabase/client';

export interface BackupRecord {
  id: string;
  data: string;
  tamanho: string;
  status: 'completo' | 'erro' | 'processando';
  tipo: 'Manual' | 'Automático';
  tabelas: string[];
  registros: number;
}

const BACKUP_TABLES = [
  'colaboradores',
  'admissoes',
  'registros_ponto',
  'folha_pagamento',
  'ferias',
  'beneficios',
  'departamentos',
  'cargos',
  'afastamentos',
  'treinamentos',
] as const;

type BackupTable = typeof BACKUP_TABLES[number];

async function fetchTableData(table: string) {
  const { data, error } = await supabase
    .from(table as any)
    .select('*')
    .limit(10000);

  if (error) throw new Error(`Erro ao exportar ${table}: ${error.message}`);
  return { table, data: (data as any[]) || [], count: (data as any[])?.length || 0 };
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function exportarBackupCSV(
  tables?: string[]
): Promise<{ blob: Blob; fileName: string; stats: { tabelas: number; registros: number; tamanho: string } }> {
  const targetTables = tables || [...BACKUP_TABLES];
  const results = await Promise.allSettled(targetTables.map(fetchTableData));

  let csvContent = '';
  let totalRecords = 0;

  for (const result of results) {
    if (result.status === 'fulfilled') {
      const { table, data, count } = result;
      totalRecords += count;

      if (data.length > 0) {
        csvContent += `\n### TABELA: ${table.toUpperCase()} (${count} registros) ###\n`;
        const headers = Object.keys(data[0]);
        csvContent += headers.join(';') + '\n';
        for (const row of data) {
          csvContent += headers.map(h => {
            const val = (row as any)[h];
            if (val === null || val === undefined) return '';
            const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
            return str.includes(';') || str.includes('\n') ? `"${str.replace(/"/g, '""')}"` : str;
          }).join(';') + '\n';
        }
      }
    }
  }

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const now = new Date();
  const fileName = `backup_dp_${now.toISOString().slice(0, 10)}_${now.toTimeString().slice(0, 5).replace(':', 'h')}.csv`;

  return {
    blob,
    fileName,
    stats: {
      tabelas: targetTables.length,
      registros: totalRecords,
      tamanho: formatBytes(blob.size),
    },
  };
}

export async function exportarBackupJSON(
  tables?: string[]
): Promise<{ blob: Blob; fileName: string; stats: { tabelas: number; registros: number; tamanho: string } }> {
  const targetTables = tables || [...BACKUP_TABLES];
  const results = await Promise.allSettled(targetTables.map(fetchTableData));

  const output: Record<string, any[]> = {};
  let totalRecords = 0;

  for (const result of results) {
    if (result.status === 'fulfilled') {
      output[result.table] = result.data;
      totalRecords += result.count;
    }
  }

  const json = JSON.stringify({
    metadata: {
      gerado_em: new Date().toISOString(),
      tabelas: Object.keys(output).length,
      total_registros: totalRecords,
    },
    dados: output,
  }, null, 2);

  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  const now = new Date();
  const fileName = `backup_dp_${now.toISOString().slice(0, 10)}_${now.toTimeString().slice(0, 5).replace(':', 'h')}.json`;

  return {
    blob,
    fileName,
    stats: {
      tabelas: Object.keys(output).length,
      registros: totalRecords,
      tamanho: formatBytes(blob.size),
    },
  };
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
