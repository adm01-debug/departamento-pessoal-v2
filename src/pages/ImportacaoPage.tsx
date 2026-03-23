import { PageTitle } from '@/components/PageTitle';
import { useState, useRef, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresa } from '@/contexts';
import { Upload, FileSpreadsheet, CheckCircle, AlertTriangle, XCircle, Download, Loader2, FileText, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
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

function validarCPF(cpf: string): boolean {
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
}

function normalizarCPF(cpf: string): string {
  return cpf?.toString().replace(/\D/g, '').padStart(11, '0') || '';
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

function mapColumns(headers: string[]): Record<number, string> {
  const map: Record<number, string> = {};
  headers.forEach((h, i) => {
    const normalized = h.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (COLUMN_MAP[normalized]) map[i] = COLUMN_MAP[normalized];
  });
  return map;
}

export default function ImportacaoPage() {
  const { empresaAtual } = useEmpresa();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'done'>('upload');
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [progress, setProgress] = useState(0);
  const [importResult, setImportResult] = useState({ success: 0, errors: 0, duplicates: 0 });
  const queryClient = useQueryClient();

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(ext || '')) {
      toast.error('Formato inválido. Use Excel (.xlsx, .xls) ou CSV');
      return;
    }

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawData = XLSX.utils.sheet_to_json<any>(sheet, { header: 1 });

      if (rawData.length < 2) { toast.error('Planilha vazia ou sem dados'); return; }

      const headers = rawData[0] as string[];
      const colMap = mapColumns(headers);

      if (!Object.values(colMap).includes('nome_completo')) {
        toast.error('Coluna "Nome" não encontrada. Verifique a planilha.');
        return;
      }

      // Check existing CPFs
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

        // Parse dates
        if (item.data_admissao) {
          const d = parseDate(item.data_admissao);
          item.data_admissao = d || item.data_admissao;
        }
        if (item.data_nascimento) {
          const d = parseDate(item.data_nascimento);
          item.data_nascimento = d || item.data_nascimento;
        }

        if (item.salario_base) item.salario_base = Number(String(item.salario_base).replace(/[^\d.,]/g, '').replace(',', '.'));

        parsed.push({
          ...item,
          cpf: cpfClean,
          status: isDuplicate ? 'duplicado' : erros.length > 0 ? 'erro' : 'valido',
          erros,
        });
      }

      setRows(parsed);
      setStep('preview');
      toast.success(`${parsed.length} registros encontrados`);
    } catch (err: any) {
      toast.error(`Erro ao ler arquivo: ${err.message}`);
    }
  }, [empresaAtual]);

  function parseDate(val: any): string | null {
    if (!val) return null;
    // Excel date serial
    if (typeof val === 'number') {
      const d = new Date((val - 25569) * 86400 * 1000);
      return d.toISOString().split('T')[0];
    }
    // DD/MM/YYYY
    const parts = String(val).match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (parts) return `${parts[3]}-${parts[2]}-${parts[1]}`;
    // Try ISO
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
  }

  const handleImport = async () => {
    const validos = rows.filter(r => r.status === 'valido');
    if (!validos.length) { toast.error('Nenhum registro válido para importar'); return; }

    setStep('importing');
    let success = 0, errors = 0;

    for (let i = 0; i < validos.length; i++) {
      const row = validos[i];
      try {
        const insertData: any = {
          nome_completo: row.nome_completo,
          cpf: row.cpf || null,
          email: row.email || null,
          telefone: row.telefone || null,
          cargo: row.cargo || 'A definir',
          departamento: row.departamento || null,
          salario_base: row.salario_base || 0,
          data_admissao: row.data_admissao || new Date().toISOString().split('T')[0],
          data_nascimento: row.data_nascimento || null,
          pis: row.pis || null,
          rg: row.rg || null,
          empresa_id: empresaAtual?.id,
          status: 'ativo',
        };
        const { error } = await supabase.from('colaboradores').insert(insertData as any);
        if (error) throw error;
        success++;
      } catch {
        errors++;
      }
      setProgress(Math.round(((i + 1) / validos.length) * 100));
    }

    const duplicates = rows.filter(r => r.status === 'duplicado').length;
    setImportResult({ success, errors, duplicates });
    setStep('done');
    queryClient.invalidateQueries({ queryKey: ['colaboradores'] });
    toast.success(`${success} colaboradores importados!`);
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ['Nome Completo', 'CPF', 'Email', 'Telefone', 'Cargo', 'Departamento', 'Salário', 'Data Admissão', 'Data Nascimento', 'PIS', 'RG'],
      ['João Silva', '123.456.789-00', 'joao@email.com', '(11)99999-9999', 'Analista', 'TI', '5000', '01/03/2024', '15/06/1990', '123.45678.90-1', '12.345.678-9'],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Modelo');
    XLSX.writeFile(wb, 'modelo_importacao_colaboradores.xlsx');
    toast.success('Modelo baixado!');
  };

  const validCount = rows.filter(r => r.status === 'valido').length;
  const errorCount = rows.filter(r => r.status === 'erro').length;
  const dupCount = rows.filter(r => r.status === 'duplicado').length;

  return (
    <>
    <PageTitle title="Importação" description="Importação de dados em massa" />
    <PageLayout
      title="Importação em Massa"
      description="Importe colaboradores via Excel ou CSV"
      icon={<Upload className="h-5 w-5 text-primary-foreground" />}
      gradient="from-info to-success"
    >
      {step === 'upload' && (
        <div className="max-w-xl mx-auto space-y-4">
          <Card className="border-border/30 rounded-2xl">
            <CardContent className="p-8">
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-border/50 rounded-2xl p-12 text-center cursor-pointer hover:border-primary/50 transition-colors"
              >
                <FileSpreadsheet className="h-16 w-16 mx-auto text-primary/40 mb-4" />
                <p className="font-display font-semibold">Arraste ou clique para selecionar</p>
                <p className="text-sm text-muted-foreground font-body mt-1">Formatos: .xlsx, .xls, .csv</p>
                <p className="text-xs text-muted-foreground/60 font-body mt-1">Máximo 1000 registros por importação</p>
              </div>
              <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFile} />
            </CardContent>
          </Card>

          <Card className="border-border/30 rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display font-semibold text-sm">Modelo de Planilha</p>
                  <p className="text-xs text-muted-foreground font-body">Baixe o modelo com as colunas corretas</p>
                </div>
                <Button variant="outline" onClick={downloadTemplate} className="rounded-xl font-body">
                  <Download className="h-4 w-4 mr-2" />Baixar Modelo
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/30 rounded-2xl">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-display">Colunas Reconhecidas</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {['Nome', 'CPF', 'Email', 'Telefone', 'Cargo', 'Departamento', 'Salário', 'Admissão', 'Nascimento', 'PIS', 'RG'].map(col => (
                  <Badge key={col} variant="outline" className="text-[10px] font-body">{col}</Badge>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground font-body mt-2">O sistema mapeia automaticamente variações como "Função", "Setor", "Celular", etc.</p>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 'preview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="border-border/30 rounded-2xl"><CardContent className="p-3 flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-success" />
              <div><p className="text-lg font-bold font-display">{validCount}</p><p className="text-[10px] text-muted-foreground font-body">Válidos</p></div>
            </CardContent></Card>
            <Card className="border-border/30 rounded-2xl"><CardContent className="p-3 flex items-center gap-3">
              <XCircle className="h-8 w-8 text-destructive" />
              <div><p className="text-lg font-bold font-display">{errorCount}</p><p className="text-[10px] text-muted-foreground font-body">Erros</p></div>
            </CardContent></Card>
            <Card className="border-border/30 rounded-2xl"><CardContent className="p-3 flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-warning" />
              <div><p className="text-lg font-bold font-display">{dupCount}</p><p className="text-[10px] text-muted-foreground font-body">Duplicados</p></div>
            </CardContent></Card>
          </div>

          {/* Table */}
          <Card className="rounded-2xl border-border/30 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-display">Status</TableHead>
                  <TableHead className="font-display">Nome</TableHead>
                  <TableHead className="font-display">CPF</TableHead>
                  <TableHead className="font-display">Cargo</TableHead>
                  <TableHead className="font-display">Departamento</TableHead>
                  <TableHead className="font-display">Salário</TableHead>
                  <TableHead className="font-display">Erros</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.slice(0, 100).map((row, i) => (
                  <TableRow key={i} className={cn("transition-colors", row.status === 'erro' && 'bg-destructive/5', row.status === 'duplicado' && 'bg-warning/5')}>
                    <TableCell>
                      <Badge className={cn("border-0 font-body text-[10px]",
                        row.status === 'valido' ? 'bg-success/15 text-success' :
                        row.status === 'duplicado' ? 'bg-warning/15 text-warning' : 'bg-destructive/15 text-destructive'
                      )}>
                        {row.status === 'valido' ? '✓' : row.status === 'duplicado' ? '⚠' : '✗'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-body text-sm font-medium">{row.nome_completo || '—'}</TableCell>
                    <TableCell className="font-body text-xs">{row.cpf || '—'}</TableCell>
                    <TableCell className="font-body text-xs">{row.cargo || '—'}</TableCell>
                    <TableCell className="font-body text-xs">{row.departamento || '—'}</TableCell>
                    <TableCell className="font-body text-xs">{row.salario_base ? `R$ ${Number(row.salario_base).toLocaleString('pt-BR')}` : '—'}</TableCell>
                    <TableCell className="text-[10px] text-destructive font-body">{row.erros.join(', ')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {rows.length > 100 && <div className="p-2 text-center text-xs text-muted-foreground font-body">Mostrando 100 de {rows.length} registros</div>}
          </Card>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => { setStep('upload'); setRows([]); }} className="rounded-xl font-body">Cancelar</Button>
            <Button onClick={handleImport} disabled={!validCount} className="rounded-xl bg-gradient-to-r from-success to-info font-body">
              <Upload className="h-4 w-4 mr-2" />Importar {validCount} Colaboradores
            </Button>
          </div>
        </motion.div>
      )}

      {step === 'importing' && (
        <div className="max-w-md mx-auto text-center space-y-4 py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="font-display font-semibold">Importando colaboradores...</p>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground font-body">{progress}% concluído</p>
        </div>
      )}

      {step === 'done' && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto text-center space-y-4 py-12">
          <CheckCircle className="h-16 w-16 text-success mx-auto" />
          <p className="font-display font-bold text-xl">Importação Concluída!</p>
          <div className="grid grid-cols-3 gap-3">
            <Card className="border-border/30 rounded-xl"><CardContent className="p-3"><p className="text-lg font-bold text-success">{importResult.success}</p><p className="text-[10px] font-body text-muted-foreground">Importados</p></CardContent></Card>
            <Card className="border-border/30 rounded-xl"><CardContent className="p-3"><p className="text-lg font-bold text-destructive">{importResult.errors}</p><p className="text-[10px] font-body text-muted-foreground">Erros</p></CardContent></Card>
            <Card className="border-border/30 rounded-xl"><CardContent className="p-3"><p className="text-lg font-bold text-warning">{importResult.duplicates}</p><p className="text-[10px] font-body text-muted-foreground">Duplicados</p></CardContent></Card>
          </div>
          <Button onClick={() => { setStep('upload'); setRows([]); setProgress(0); }} className="rounded-xl font-body">Nova Importação</Button>
        </motion.div>
      )}
    </PageLayout>
    </>
  );
}
