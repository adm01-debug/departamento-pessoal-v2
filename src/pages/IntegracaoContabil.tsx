import { SEOHead } from '@/components/SEOHead';
import { useState, useEffect, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { 
  Calculator, 
  Download, 
  FileSpreadsheet, 
  FileText,
  Loader2,
  Building2,
  Calendar,
  Upload
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEmpresas } from '@/hooks/useEmpresas';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

interface ExportConfig {
  competencia: string;
  formato: 'txt' | 'csv' | 'xlsx';
  layout: 'dominio' | 'contmatic' | 'fortes' | 'questor' | 'padrao';
  incluirProventos: boolean;
  incluirDescontos: boolean;
  incluirEncargos: boolean;
}

export default function IntegracaoContabil() {
  useEffect(() => {
    document.title = 'Integração Contábil | DP System';
  }, []);

  const { empresaAtual } = useEmpresas();
  const [config, setConfig] = useState<ExportConfig>({
    competencia: format(new Date(), 'yyyy-MM'),
    formato: 'xlsx',
    layout: 'padrao',
    incluirProventos: true,
    incluirDescontos: true,
    incluirEncargos: true
  });
  const [exporting, setExporting] = useState(false);

  // Buscar folhas de pagamento
  const { data: folhas = [], isLoading } = useQuery({
    queryKey: ['folhas-contabil', empresaAtual?.id],
    queryFn: async () => {
      let query = supabase
        .from('folhas_pagamento')
        .select('*')
        .order('competencia', { ascending: false });
      
      if (empresaAtual?.id) {
        query = query.eq('empresa_id', empresaAtual.id);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  // Buscar holerites da competência selecionada
  const { data: holerites = [] } = useQuery({
    queryKey: ['holerites-contabil', config.competencia],
    queryFn: async () => {
      const { data: folha } = await supabase
        .from('folhas_pagamento')
        .select('id')
        .eq('competencia', config.competencia)
        .maybeSingle();

      if (!folha) return [];

      const { data, error } = await supabase
        .from('holerites')
        .select('*, lancamentos_folha(*)')
        .eq('folha_id', folha.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!config.competencia
  });

  const competencias = [...new Set(folhas.map((f: unknown) => f.competencia))];

  const handleExportar = async () => {
    if (holerites.length === 0) {
      toast.error('Nenhum dado encontrado para a competência selecionada');
      return;
    }

    setExporting(true);
    try {
      const dados = gerarDadosExportacao();
      
      if (config.formato === 'xlsx') {
        exportarXLSX(dados);
      } else if (config.formato === 'csv') {
        exportarCSV(dados);
      } else {
        exportarTXT(dados);
      }
      
      toast.success('Arquivo exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar arquivo');
    } finally {
      setExporting(false);
    }
  };

  const gerarDadosExportacao = () => {
    const linhas: unknown[] = [];
    
    holerites.forEach((holerite: unknown) => {
      // Linha do colaborador
      const linhaBase = {
        competencia: config.competencia,
        matricula: holerite.colaborador_matricula ?? '',
        cpf: holerite.colaborador_cpf,
        nome: holerite.colaborador_nome,
        cargo: holerite.colaborador_cargo,
        departamento: holerite.colaborador_departamento,
        salario_base: holerite.salario_base,
        total_proventos: holerite.total_proventos,
        total_descontos: holerite.total_descontos,
        liquido: holerite.liquido,
        valor_inss: holerite.valor_inss ?? 0,
        valor_irrf: holerite.valor_irrf ?? 0,
        valor_fgts: holerite.valor_fgts ?? 0
      };
      
      linhas.push(linhaBase);
    });

    return linhas;
  };

  const exportarXLSX = (dados: unknown[]) => {
    const ws = XLSX.utils.json_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Folha de Pagamento');
    
    // Adicionar aba de resumo
    const resumo = [{
      total_colaboradores: dados.length,
      total_proventos: dados.reduce((sum, d) => sum + d.total_proventos, 0),
      total_descontos: dados.reduce((sum, d) => sum + d.total_descontos, 0),
      total_liquido: dados.reduce((sum, d) => sum + d.liquido, 0),
      total_inss: dados.reduce((sum, d) => sum + d.valor_inss, 0),
      total_irrf: dados.reduce((sum, d) => sum + d.valor_irrf, 0),
      total_fgts: dados.reduce((sum, d) => sum + d.valor_fgts, 0)
    }];
    const wsResumo = XLSX.utils.json_to_sheet(resumo);
    XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo');
    
    XLSX.writeFile(wb, `folha_${config.competencia}_${config.layout}.xlsx`);
  };

  const exportarCSV = (dados: unknown[]) => {
    const headers = Object.keys(dados[0]).join(';');
    const rows = dados.map(d => Object.values(d).join(';'));
    const csv = [headers, ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `folha_${config.competencia}_${config.layout}.csv`;
    link.click();
  };

  const exportarTXT = (dados: unknown[]) => {
    let txt = '';
    
    if (config.layout === 'dominio') {
      // Formato Domínio Sistemas
      dados.forEach(d => {
        txt += `${d.matricula.padStart(6, '0')}`;
        txt += `${d.cpf.replace(/\D/g, '').padStart(11, '0')}`;
        txt += `${d.nome.substring(0, 40).padEnd(40, ' ')}`;
        txt += `${(d.salario_base * 100).toFixed(0).padStart(12, '0')}`;
        txt += `${(d.liquido * 100).toFixed(0).padStart(12, '0')}`;
        txt += '\n';
      });
    } else {
      // Formato padrão (legível)
      dados.forEach(d => {
        txt += `CPF: ${d.cpf} | Nome: ${d.nome} | Líquido: R$ ${d.liquido.toFixed(2)}\n`;
      });
    }
    
    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `folha_${config.competencia}_${config.layout}.txt`;
    link.click();
  };

  const layoutOptions = [
    { value: 'padrao', label: 'Padrão (Planilha)' },
    { value: 'dominio', label: 'Domínio Sistemas' },
    { value: 'contmatic', label: 'Contmatic' },
    { value: 'fortes', label: 'Fortes Tecnologia' },
    { value: 'questor', label: 'Questor' }
  ];

  return (
      <>
        <SEOHead title="Integração Contábil" description="Integração com sistemas contábeis" />
        <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            Integração Contábil
          </h1>
          <p className="text-muted-foreground">Exporte dados para sistemas contábeis</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Configuração de Exportação */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Configurar Exportação</CardTitle>
            <CardDescription>Defina os parâmetros para exportação dos dados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Competência</Label>
                <Select 
                  value={config.competencia} 
                  onValueChange={(v) => setConfig(prev => ({ ...prev, competencia: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a competência" />
                  </SelectTrigger>
                  <SelectContent>
                    {competencias.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Layout do Sistema</Label>
                <Select 
                  value={config.layout} 
                  onValueChange={(v: unknown) => setConfig(prev => ({ ...prev, layout: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {layoutOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Formato do Arquivo</Label>
                <Select 
                  value={config.formato} 
                  onValueChange={(v: unknown) => setConfig(prev => ({ ...prev, formato: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                    <SelectItem value="csv">CSV (.csv)</SelectItem>
                    <SelectItem value="txt">Texto (.txt)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Incluir no Arquivo</Label>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={config.incluirProventos}
                    onCheckedChange={(c) => setConfig(prev => ({ ...prev, incluirProventos: !!c }))}
                  />
                  <span className="text-sm">Proventos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={config.incluirDescontos}
                    onCheckedChange={(c) => setConfig(prev => ({ ...prev, incluirDescontos: !!c }))}
                  />
                  <span className="text-sm">Descontos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={config.incluirEncargos}
                    onCheckedChange={(c) => setConfig(prev => ({ ...prev, incluirEncargos: !!c }))}
                  />
                  <span className="text-sm">Encargos (INSS, FGTS, IRRF)</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleExportar} 
              disabled={exporting || holerites.length === 0}
              className="w-full"
            >
              {exporting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Exportar Arquivo
            </Button>
          </CardContent>
        </Card>

        {/* Resumo da Competência */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumo</CardTitle>
            <CardDescription>Competência: {config.competencia}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {holerites.length > 0 ? (
              <>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <span className="text-sm">Colaboradores</span>
                  <Badge variant="secondary">{holerites.length}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-success/10">
                  <span className="text-sm">Total Proventos</span>
                  <span className="font-medium text-success">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                      .format(holerites.reduce((sum: number, h: unknown) => sum + h.total_proventos, 0))}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-destructive/10">
                  <span className="text-sm">Total Descontos</span>
                  <span className="font-medium text-destructive">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                      .format(holerites.reduce((sum: number, h: unknown) => sum + h.total_descontos, 0))}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-primary/10">
                  <span className="text-sm font-medium">Total Líquido</span>
                  <span className="font-bold text-primary">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                      .format(holerites.reduce((sum: number, h: unknown) => sum + h.liquido, 0))}
                  </span>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Encargos</h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-xs text-muted-foreground">INSS</p>
                      <p className="text-sm font-medium">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                          .format(holerites.reduce((sum: number, h: unknown) => sum + (h.valor_inss ?? 0), 0))}
                      </p>
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-xs text-muted-foreground">IRRF</p>
                      <p className="text-sm font-medium">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                          .format(holerites.reduce((sum: number, h: unknown) => sum + (h.valor_irrf ?? 0), 0))}
                      </p>
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-xs text-muted-foreground">FGTS</p>
                      <p className="text-sm font-medium">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                          .format(holerites.reduce((sum: number, h: unknown) => sum + (h.valor_fgts ?? 0), 0))}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Nenhum dado encontrado</p>
                <p className="text-xs">Selecione outra competência</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Histórico de Exportações */}
      <Card>
        <CardHeader>
          <CardTitle>Sistemas Suportados</CardTitle>
          <CardDescription>Layouts compatíveis para exportação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            {layoutOptions.map(layout => (
              <div 
                key={layout.value}
                className={`p-4 rounded-lg border text-center transition-all cursor-pointer ${
                  config.layout === layout.value ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                }`}
                onClick={() => setConfig(prev => ({ ...prev, layout: layout.value as any }))}
              >
                <Building2 className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-medium text-sm">{layout.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  
      </>);
}






