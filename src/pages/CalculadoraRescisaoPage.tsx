import { PageTitle } from '@/components/PageTitle';
import { useState, useCallback } from 'react';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Calculator, Download, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { calcularRescisao, fmt, type RescisaoResult } from '@/utils/rescisaoCalc';
import { gerarPDFRescisao } from '@/utils/rescisaoPDF';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

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
    setResult(calcularRescisao({
      salario: Number(form.salario),
      dataAdmissao: form.dataAdmissao,
      dataDesligamento: form.dataDesligamento,
      tipo: form.tipo,
      avisoTrabalhado: form.avisoTrabalhado,
      feriasVencidas: form.feriasVencidas,
      saldoFGTS: Number(form.saldoFGTS || 0),
    }));
  }, [form]);

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  return (
    <>
    <PageTitle title="Calculadora de Rescisão" description="Cálculo rescisório trabalhista" />
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
                    {([
                      ['Saldo de Salário', `${result.diasTrabalhados} dias`, result.saldoSalario],
                      ['Aviso Prévio Indenizado', `${result.diasAviso} dias`, result.avisoIndenizado],
                      ['Férias Vencidas', '', result.feriasVencidas],
                      ['Férias Proporcionais', `${result.mesesFerias}/12`, result.feriasProporcionais],
                      ['1/3 Constitucional', '', result.tercoFerias],
                      ['13º Proporcional', `${result.meses13}/12`, result.decimoTerceiro],
                    ] as [string, string, number][]).map(([label, ref, val]) => (
                      <div key={label} className="flex justify-between text-xs font-body">
                        <span>{label}</span>
                        <span className="text-muted-foreground">{ref}</span>
                        <span className="font-medium">R$ {fmt(val)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-xs font-display font-bold border-t border-border/30 pt-1">
                      <span>Total Proventos</span><span className="text-success">R$ {fmt(result.totalProventos)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <p className="text-xs font-display font-semibold text-destructive">DESCONTOS</p>
                    {([
                      ['INSS', result.inss],
                      ['IRRF', result.irrf],
                    ] as [string, number][]).map(([label, val]) => (
                      <div key={label} className="flex justify-between text-xs font-body">
                        <span>{label}</span><span className="font-medium text-destructive">R$ {fmt(val)}</span>
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
    </>
  );
}
