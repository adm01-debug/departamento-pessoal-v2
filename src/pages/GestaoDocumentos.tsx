import { SEOHead } from '@/components/SEOHead';
import { useState, memo, useEffect, useMemo } from 'react';
import DOMPurify from 'dompurify';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  FileText, 
  Plus, 
  Download, 
  Eye, 
  Loader2,
  FileCheck,
  Printer
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useColaboradores } from '@/hooks/useColaboradores';
import { useEmpresas } from '@/hooks/useEmpresas';
import { format } from 'date-fns';

export default memo(function GestaoDocumentos() {
  useEffect(() => {
    document.title = 'Gestão de Documentos | DP System';
  }, []);

  const queryClient = useQueryClient();
  const { colaboradores } = useColaboradores();
  const { empresaAtual } = useEmpresas();
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [selectedColaborador, setSelectedColaborador] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  
  // Sanitizar HTML para prevenir XSS
  const sanitizedPreviewHtml = useMemo(() => {
    return DOMPurify.sanitize(previewHtml, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
                     'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 
                     'div', 'span', 'a', 'img'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'style', 'target'],
      ALLOW_DATA_ATTR: false
    });
  }, [previewHtml]);
  const [showPreview, setShowPreview] = useState(false);
  const [customVariables, setCustomVariables] = useState<Record<string, string>>({});

  const colaboradoresAtivos = colaboradores.filter(c => c.status === 'ativo');

  // Buscar templates
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['documento-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documento_templates')
        .select('*')
        .eq('ativo', true)
        .order('categoria', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  // Agrupar templates por categoria
  const templatesPorCategoria = templates.reduce((acc: unknown, t: unknown) => {
    if (!acc[t.categoria]) acc[t.categoria] = [];
    acc[t.categoria].push(t);
    return acc;
  }, {});

  // Função para substituir variáveis no template
  const processarTemplate = (template: unknown, colaborador: unknown) => {
    let html = template.conteudo_html;
    
    const variaveis: Record<string, string> = {
      nome_colaborador: colaborador?.nome_completo ?? '',
      cpf: colaborador?.cpf ?? '',
      rg: colaborador?.rg ?? '',
      cargo: colaborador?.cargo ?? '',
      departamento: colaborador?.departamento ?? '',
      data_admissao: colaborador?.data_admissao ? format(new Date(colaborador.data_admissao), 'dd/MM/yyyy') : '',
      jornada_semanal: colaborador?.jornada_semanal?.toString() || '44',
      salario: colaborador?.salario_base ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(colaborador.salario_base) : '',
      empresa_razao_social: empresaAtual?.razao_social ?? '',
      empresa_cnpj: empresaAtual?.cnpj ?? '',
      cidade: empresaAtual?.cidade ?? '',
      data_atual: format(new Date(), 'dd/MM/yyyy'),
      ...customVariables
    };

    Object.entries(variaveis).forEach(([key, value]) => {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    return html;
  };

  const handleGerarDocumento = () => {
    if (!selectedTemplate || !selectedColaborador) {
      toast.error('Selecione um template e um colaborador');
      return;
    }

    const colaborador = colaboradoresAtivos.find(c => c.id === selectedColaborador);
    const html = processarTemplate(selectedTemplate, colaborador);
    setPreviewHtml(html);
    setShowPreview(true);
  };

  const handleImprimir = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${selectedTemplate?.nome || 'Documento'}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { font-size: 18px; margin-bottom: 20px; }
            p { line-height: 1.6; margin-bottom: 15px; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>${sanitizedPreviewHtml}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownloadPDF = () => {
    toast.info('Para salvar como PDF, use a opção "Salvar como PDF" na janela de impressão');
    handleImprimir();
  };

  // Identificar variáveis customizadas que precisam ser preenchidas
  const getVariaveisCustomizadas = (template: unknown) => {
    if (!template) return [];
    const variaveis = template.variaveis ?? [];
    const variavelPadrao = [
      'nome_colaborador', 'cpf', 'rg', 'cargo', 'departamento', 
      'data_admissao', 'jornada_semanal', 'salario',
      'empresa_razao_social', 'empresa_cnpj', 'cidade', 'data_atual'
    ];
    return variaveis.filter((v: string) => !variavelPadrao.includes(v));
  };

  const tipoColors: Record<string, string> = {
    declaracao: 'bg-info/20 text-info',
    atestado: 'bg-success/20 text-success',
    termo: 'bg-warning/20 text-warning',
    aviso: 'bg-primary/20 text-primary'
  };

  return (
      <>
        <SEOHead title="Gestão de Documentos" description="Gerenciamento de documentos" />
        <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileCheck className="h-6 w-6 text-primary" />
            Gestão de Documentos
          </h1>
          <p className="text-muted-foreground">Gere documentos a partir de templates</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Lista de Templates */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Templates Disponíveis</CardTitle>
            <CardDescription>{templates.length} templates ativos</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(templatesPorCategoria).map(([categoria, items]: [string, any]) => (
                  <div key={categoria}>
                    <h4 className="text-sm font-medium text-muted-foreground uppercase mb-2">
                      {categoria}
                    </h4>
                    <div className="space-y-2">
                      {items.map((template: unknown) => (
                        <div
                          key={template.id}
                          onClick={() => {
                            setSelectedTemplate(template);
                            setCustomVariables({});
                          }}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedTemplate?.id === template.id 
                              ? 'border-primary bg-primary/5' 
                              : 'hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{template.nome}</span>
                            <Badge className={tipoColors[template.tipo] ?? ''} variant="secondary">
                              {template.tipo}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Formulário de Geração */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Gerar Documento</CardTitle>
            <CardDescription>
              {selectedTemplate 
                ? `Template selecionado: ${selectedTemplate.nome}` 
                : 'Selecione um template para continuar'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedTemplate ? (
              <>
                <div className="space-y-2">
                  <Label>Colaborador</Label>
                  <Select value={selectedColaborador} onValueChange={setSelectedColaborador}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o colaborador" />
                    </SelectTrigger>
                    <SelectContent>
                      {colaboradoresAtivos.map(c => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.nome_completo} - {c.cargo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Variáveis customizadas */}
                {getVariaveisCustomizadas(selectedTemplate).length > 0 && (
                  <div className="space-y-3 pt-2">
                    <Label className="text-muted-foreground">Campos adicionais</Label>
                    {getVariaveisCustomizadas(selectedTemplate).map((varName: string) => (
                      <div key={varName} className="space-y-1">
                        <Label className="text-sm capitalize">
                          {varName.replace(/_/g, ' ')}
                        </Label>
                        <Input
                          value={customVariables[varName] ?? ''}
                          onChange={(e) => setCustomVariables(prev => ({
                            ...prev,
                            [varName]: e.target.value
                          }))}
                          placeholder={`Informe ${varName.replace(/_/g, ' ')}`}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleGerarDocumento}
                    disabled={!selectedColaborador}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Selecione um template na lista ao lado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de Preview */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.nome}</DialogTitle>
          </DialogHeader>
          <div 
            className="prose prose-sm max-w-none p-6 border rounded-lg bg-white text-black"
            dangerouslySetInnerHTML={{ __html: sanitizedPreviewHtml }}
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Fechar
            </Button>
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Salvar PDF
            </Button>
            <Button onClick={handleImprimir}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  
      </>);
}
