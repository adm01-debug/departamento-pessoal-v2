import { useState, useCallback } from 'react';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Calculator, Download, FileText, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Tabela INSS 2026
function calcINSS(salario: number): number {
  const faixas = [
    { teto: 1518.00, aliq: 0.075 },
    { teto: 2793.88, aliq: 0.09 },
    { teto: 4190.83, aliq: 0.12 },
    { teto: 8157.41, aliq: 0.14 },
  ];
  let desc = 0; let anterior = 0;
  for (const f of faixas) {
    const base = Math.min(salario, f.teto) - anterior;
    if (base <= 0) break;
    desc += base * f.aliq;
    anterior = f.teto;
  }
  return desc;
}

// IRRF 2026
function calcIRRF(base: number): number {
  if (base <= 2259.20) return 0;
  if (base <= 2826.65) return base * 0.075 - 169.44;
  if (base <= 3751.05) return base * 0.15 - 381.44;
  if (base <= 4664.68) return base * 0.225 - 662.77;
  return base * 0.275 - 896.00;
}

interface RescisaoResult {
  saldoSalario: number;
  avisoIndenizado: number;
  feriasVencidas: number;
  feriasProporcionais: number;
  tercoFerias: number;
  decimoTerceiro: number;
  multaFGTS: number;
  fgtsRescisao: number;
  totalProventos: number;
  inss: number;
  irrf: number;
  totalDescontos: number;
  totalLiquido: number;
  diasTrabalhados: number;
  mesesFerias: number;
  meses13: number;
  diasAviso: number;
}

function calcularRescisao(params: {
  salario: number;
  dataAdmissao: string;
  dataDesligamento: string;
  tipo: string;
  avisoTrabalhado: boolean;
  feriasVencidas: boolean;
  saldoFGTS: number;
}): RescisaoResult {
  const { salario, dataAdmissao, dataDesligamento, tipo, avisoTrabalhado, feriasVencidas, saldoFGTS } = params;
  const admissao = new Date(dataAdmissao);
  const desligamento = new Date(dataDesligamento);

  // Dias trabalhados no mês
  const diasNoMes = new Date(desligamento.getFullYear(), desligamento.getMonth() + 1, 0).getDate();
  const diasTrabalhados = desligamento.getDate();
  const saldoSalario = (salario / diasNoMes) * diasTrabalhados;

  // Aviso prévio (30 dias + 3 por ano trabalhado)
  const anosTrabalho = Math.floor((desligamento.getTime() - admissao.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  const diasAviso = Math.min(90, 30 + anosTrabalho * 3);
  const avisoIndenizado = (tipo === 'sem_justa_causa' && !avisoTrabalhado) ? (salario / 30) * diasAviso : 0;

  // Férias proporcionais
  const ultimoAniversario = new Date(admissao);
  ultimoAniversario.setFullYear(desligamento.getFullYear());
  if (ultimoAniversario > desligamento) ultimoAniversario.setFullYear(ultimoAniversario.getFullYear() - 1);
  const mesesDesdeAniversario = Math.ceil((desligamento.getTime() - ultimoAniversario.getTime()) / (30 * 24 * 60 * 60 * 1000));
  const mesesFerias = Math.min(12, Math.max(0, mesesDesdeAniversario));
  const feriasProporcionaisVal = tipo !== 'justa_causa' ? (salario / 12) * mesesFerias : 0;
  const feriasVencidasVal = feriasVencidas && tipo !== 'justa_causa' ? salario : 0;
  const tercoFerias = (feriasProporcionaisVal + feriasVencidasVal) / 3;

  // 13º proporcional
  const meses13 = desligamento.getMonth() + 1;
  const decimoTerceiro = tipo !== 'justa_causa' ? (salario / 12) * meses13 : 0;

  // FGTS
  const fgtsRescisao = (saldoSalario + avisoIndenizado) * 0.08;
  const multaFGTS = tipo === 'sem_justa_causa' ? (saldoFGTS + fgtsRescisao) * 0.40 : 0;

  // Totais
  const totalProventos = saldoSalario + avisoIndenizado + feriasVencidasVal + feriasProporcionaisVal + tercoFerias + decimoTerceiro;
  const inss = calcINSS(saldoSalario);
  const baseIRRF = saldoSalario - inss;
  const irrf = calcIRRF(baseIRRF);
  const totalDescontos = inss + irrf;
  const totalLiquido = totalProventos - totalDescontos + multaFGTS;

  return {
    saldoSalario, avisoIndenizado, feriasVencidas: feriasVencidasVal, feriasProporcionais: feriasProporcionaisVal,
    tercoFerias, decimoTerceiro, multaFGTS, fgtsRescisao, totalProventos, inss, irrf, totalDescontos, totalLiquido,
    diasTrabalhados, mesesFerias, meses13, diasAviso,
  };
}

function fmt(v: number) { return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

function gerarPDFRescisao(form: any, result: RescisaoResult) {
  const doc = new jsPDF();
  const pw = doc.internal.pageSize.getWidth();
  let y = 20;

  doc.setFontSize(14); doc.setFont('helvetica', 'bold');
  doc.text('TERMO DE RESCISÃO DO CONTRATO DE TRABALHO', pw / 2, y, { align: 'center' }); y += 12;

  doc.setFontSize(10); doc.setFont('helvetica', 'normal');
  doc.text(`Colaborador: ${form.nomeColaborador || '—'}`, 14, y); y += 6;
  doc.text(`CPF: ${form.cpf || '—'}`, 14, y); y += 6;
  doc.text(`Cargo: ${form.cargo || '—'}`, 14, y); y += 6;
  doc.text(`Admissão: ${form.dataAdmissao ? new Date(form.dataAdmissao).toLocaleDateString('pt-BR') : '—'}`, 14, y);
  doc.text(`Desligamento: ${form.dataDesligamento ? new Date(form.dataDesligamento).toLocaleDateString('pt-BR') : '—'}`, 110, y); y += 6;
  doc.text(`Tipo: ${form.tipo === 'sem_justa_causa' ? 'Sem Justa Causa' : form.tipo === 'justa_causa' ? 'Justa Causa' : 'Pedido de Demissão'}`, 14, y); y += 10;

  (doc as any).autoTable({
    startY: y,
    head: [['Verba', 'Referência', 'Valor (R$)']],
    body: [
      ['Saldo de Salário', `${result.diasTrabalhados} dias`, fmt(result.saldoSalario)],
      ['Aviso Prévio Indenizado', `${result.diasAviso} dias`, fmt(result.avisoIndenizado)],
      ['Férias Vencidas', result.feriasVencidas > 0 ? '30 dias' : '—', fmt(result.feriasVencidas)],
      ['Férias Proporcionais', `${result.mesesFerias}/12 avos`, fmt(result.feriasProporcionais)],
      ['1/3 Constitucional', '', fmt(result.tercoFerias)],
      ['13º Proporcional', `${result.meses13}/12 avos`, fmt(result.decimoTerceiro)],
      ['', 'TOTAL PROVENTOS', fmt(result.totalProventos)],
      ['INSS', '', `(${fmt(result.inss)})`],
      ['IRRF', '', `(${fmt(result.irrf)})`],
      ['', 'TOTAL DESCONTOS', `(${fmt(result.totalDescontos)})`],
      ['Multa FGTS (40%)', '', fmt(result.multaFGTS)],
      ['FGTS s/ Rescisão', '', fmt(result.fgtsRescisao)],
      ['', 'VALOR LÍQUIDO', fmt(result.totalLiquido)],
    ],
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 9 },
  });

  y = (doc as any).lastAutoTable.finalY + 20;
  const hoje = new Date().toLocaleDateString('pt-BR');
  doc.text(`Data: ${hoje}`, pw / 2, y, { align: 'center' }); y += 20;
  doc.line(14, y, 90, y); doc.line(pw - 90, y, pw - 14, y); y += 5;
  doc.setFontSize(9);
  doc.text('EMPREGADOR', 52, y, { align: 'center' });
  doc.text('EMPREGADO(A)', pw - 52, y, { align: 'center' });

  doc.save(`TRCT_${(form.nomeColaborador || 'rescisao').replace(/\s/g, '_')}.pdf`);
  toast.success('TRCT gerado com sucesso!');
}

export default function CalculadoraRescisaoPage() {
  const [form, setForm] = useState({
    nomeColaborador: '', cpf: '', cargo: '', salario: '',
    dataAdmissao: '', dataDesligamento: '', tipo: 'sem_justa_causa',
    avisoTrabalhado: false, feriasVencidas: false, saldoFGTS: '',
  });
  const [result, setResult] = useState<RescisaoResult | null>(null);

  const handleCalc = useCallback(() => {
    if (!form.salario || !form.dataAdmissao || !form.dataDesligamento) {
      toast.error('Preencha salário, data de admissão e desligamento');
      return;
    }
    const r = calcularRescisao({
      salario: Number(form.salario),
      dataAdmissao: form.dataAdmissao,
      dataDesligamento: form.dataDesligamento,
      tipo: form.tipo,
      avisoTrabalhado: form.avisoTrabalhado,
      feriasVencidas: form.feriasVencidas,
      saldoFGTS: Number(form.saldoFGTS || 0),
    });
    setResult(r);
  }, [form]);

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  return (
    <PageLayout
      title="Calculadora de Rescisão"
      description="Cálculo completo de verbas rescisórias com geração de TRCT"
      icon={<Calculator className="h-5 w-5 text-primary-foreground" />}
      gradient="from-warning to-destructive"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card className="border-border/30 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base font-display">Dados da Rescisão</CardTitle>
            <CardDescription className="font-body text-xs">Preencha os dados para calcular as verbas rescisórias</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="font-body text-xs">Nome do Colaborador</Label><Input value={form.nomeColaborador} onChange={e => set('nomeColaborador', e.target.value)} className="rounded-xl" placeholder="Nome completo" /></div>
              <div><Label className="font-body text-xs">CPF</Label><Input value={form.cpf} onChange={e => set('cpf', e.target.value)} className="rounded-xl" placeholder="000.000.000-00" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="font-body text-xs">Cargo</Label><Input value={form.cargo} onChange={e => set('cargo', e.target.value)} className="rounded-xl" /></div>
              <div><Label className="font-body text-xs">Salário Base (R$)</Label><Input type="number" value={form.salario} onChange={e => set('salario', e.target.value)} className="rounded-xl" placeholder="0.00" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="font-body text-xs">Data Admissão</Label><Input type="date" value={form.dataAdmissao} onChange={e => set('dataAdmissao', e.target.value)} className="rounded-xl" /></div>
              <div><Label className="font-body text-xs">Data Desligamento</Label><Input type="date" value={form.dataDesligamento} onChange={e => set('dataDesligamento', e.target.value)} className="rounded-xl" /></div>
            </div>
            <div><Label className="font-body text-xs">Tipo de Rescisão</Label>
              <Select value={form.tipo} onValueChange={v => set('tipo', v)}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sem_justa_causa">Sem Justa Causa</SelectItem>
                  <SelectItem value="justa_causa">Justa Causa</SelectItem>
                  <SelectItem value="pedido_demissao">Pedido de Demissão</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label className="font-body text-xs">Saldo FGTS (R$)</Label><Input type="number" value={form.saldoFGTS} onChange={e => set('saldoFGTS', e.target.value)} className="rounded-xl" placeholder="0.00" /></div>
            <div className="flex items-center justify-between"><Label className="font-body text-xs">Aviso prévio trabalhado?</Label><Switch checked={form.avisoTrabalhado} onCheckedChange={v => set('avisoTrabalhado', v)} /></div>
            <div className="flex items-center justify-between"><Label className="font-body text-xs">Possui férias vencidas?</Label><Switch checked={form.feriasVencidas} onCheckedChange={v => set('feriasVencidas', v)} /></div>

            <Button onClick={handleCalc} className="w-full rounded-xl bg-gradient-to-r from-warning to-destructive font-body">
              <Calculator className="h-4 w-4 mr-2" />Calcular Rescisão
            </Button>
          </CardContent>
        </Card>

        {/* Result */}
        <div className="space-y-4">
          {result ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-border/30 rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-display">Resultado da Rescisão</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <p className="text-xs font-display font-semibold text-success">PROVENTOS</p>
                    {[
                      ['Saldo de Salário', `${result.diasTrabalhados} dias`, result.saldoSalario],
                      ['Aviso Prévio Indenizado', `${result.diasAviso} dias`, result.avisoIndenizado],
                      ['Férias Vencidas', '', result.feriasVencidas],
                      ['Férias Proporcionais', `${result.mesesFerias}/12`, result.feriasProporcionais],
                      ['1/3 Constitucional', '', result.tercoFerias],
                      ['13º Proporcional', `${result.meses13}/12`, result.decimoTerceiro],
                    ].map(([label, ref, val]) => (
                      <div key={label as string} className="flex justify-between text-xs font-body">
                        <span>{label}</span>
                        <span className="text-muted-foreground">{ref}</span>
                        <span className="font-medium">R$ {fmt(val as number)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-xs font-display font-bold border-t border-border/30 pt-1">
                      <span>Total Proventos</span><span className="text-success">R$ {fmt(result.totalProventos)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <p className="text-xs font-display font-semibold text-destructive">DESCONTOS</p>
                    {[
                      ['INSS', result.inss],
                      ['IRRF', result.irrf],
                    ].map(([label, val]) => (
                      <div key={label as string} className="flex justify-between text-xs font-body">
                        <span>{label}</span><span className="font-medium text-destructive">R$ {fmt(val as number)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-xs font-display font-bold border-t border-border/30 pt-1">
                      <span>Total Descontos</span><span className="text-destructive">R$ {fmt(result.totalDescontos)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <p className="text-xs font-display font-semibold text-info">FGTS</p>
                    <div className="flex justify-between text-xs font-body"><span>FGTS sobre Rescisão</span><span>R$ {fmt(result.fgtsRescisao)}</span></div>
                    <div className="flex justify-between text-xs font-body"><span>Multa 40% FGTS</span><span className="font-medium text-info">R$ {fmt(result.multaFGTS)}</span></div>
                  </div>

                  <Separator />

                  <div className="bg-primary/5 rounded-xl p-3">
                    <div className="flex justify-between font-display font-bold">
                      <span>VALOR LÍQUIDO</span>
                      <span className="text-lg text-primary">R$ {fmt(result.totalLiquido)}</span>
                    </div>
                  </div>

                  <Button onClick={() => gerarPDFRescisao(form, result)} className="w-full rounded-xl bg-gradient-to-r from-primary to-primary-glow font-body">
                    <Download className="h-4 w-4 mr-2" />Gerar TRCT (PDF)
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="border-border/30 rounded-2xl">
              <CardContent className="py-16 text-center">
                <Calculator className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground font-body">Preencha os dados e clique em Calcular</p>
                <p className="text-xs text-muted-foreground/60 font-body mt-1">Cálculos baseados nas tabelas INSS/IRRF 2026</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
