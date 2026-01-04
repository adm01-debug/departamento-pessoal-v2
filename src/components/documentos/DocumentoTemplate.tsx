import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileTemplate, Plus, Edit, Trash2, Copy, Download, Eye, Variable } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Template {
  id: string;
  nome: string;
  descricao?: string;
  categoria: string;
  tipo: "contrato" | "declaracao" | "comunicado" | "formulario" | "recibo" | "outros";
  conteudo: string;
  variaveis: string[];
  formato_saida: "pdf" | "docx" | "html";
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

interface DocumentoTemplateProps {
  templates: Template[];
  onCriar?: (template: Partial<Template>) => Promise<void>;
  onEditar?: (id: string, template: Partial<Template>) => Promise<void>;
  onExcluir?: (id: string) => Promise<void>;
  onDuplicar?: (id: string) => Promise<void>;
  onGerar?: (templateId: string, variaveis: Record<string, string>) => Promise<string>;
  onPreview?: (templateId: string, variaveis: Record<string, string>) => Promise<string>;
  modoVisualizacao?: boolean;
}

const tiposTemplate = [
  { value: "contrato", label: "Contrato" },
  { value: "declaracao", label: "Declaração" },
  { value: "comunicado", label: "Comunicado" },
  { value: "formulario", label: "Formulário" },
  { value: "recibo", label: "Recibo" },
  { value: "outros", label: "Outros" }
];

const variaveisComuns = [
  "{{colaborador_nome}}", "{{colaborador_cpf}}", "{{colaborador_cargo}}",
  "{{empresa_nome}}", "{{empresa_cnpj}}", "{{data_atual}}",
  "{{data_admissao}}", "{{salario}}", "{{departamento}}"
];

export function DocumentoTemplate({
  templates,
  onCriar,
  onEditar,
  onExcluir,
  onDuplicar,
  onGerar,
  onPreview,
  modoVisualizacao = false
}: DocumentoTemplateProps) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [gerarDialogOpen, setGerarDialogOpen] = useState(false);
  const [editando, setEditando] = useState<Template | null>(null);
  const [templateSelecionado, setTemplateSelecionado] = useState<Template | null>(null);
  const [valoresVariaveis, setValoresVariaveis] = useState<Record<string, string>>({});
  const [form, setForm] = useState<Partial<Template>>({
    nome: "", tipo: "contrato", conteudo: "", formato_saida: "pdf", variaveis: []
  });

  const extrairVariaveis = (conteudo: string): string[] => {
    const regex = /\{\{([^}]+)\}\}/g;
    const matches = conteudo.match(regex) || [];
    return [...new Set(matches)];
  };

  const handleConteudoChange = (conteudo: string) => {
    const variaveis = extrairVariaveis(conteudo);
    setForm({ ...form, conteudo, variaveis });
  };

  const handleSubmit = async () => {
    if (!form.nome || !form.conteudo) {
      toast({ title: "Erro", description: "Nome e conteúdo são obrigatórios", variant: "destructive" });
      return;
    }
    try {
      if (editando) {
        await onEditar?.(editando.id, form);
        toast({ title: "Sucesso", description: "Template atualizado" });
      } else {
        await onCriar?.(form);
        toast({ title: "Sucesso", description: "Template criado" });
      }
      setForm({ nome: "", tipo: "contrato", conteudo: "", formato_saida: "pdf", variaveis: [] });
      setEditando(null);
      setDialogOpen(false);
    } catch {
      toast({ title: "Erro", description: "Falha ao salvar template", variant: "destructive" });
    }
  };

  const handleEditar = (template: Template) => {
    setEditando(template);
    setForm(template);
    setDialogOpen(true);
  };

  const handleGerar = async () => {
    if (!templateSelecionado) return;
    try {
      const url = await onGerar?.(templateSelecionado.id, valoresVariaveis);
      if (url) {
        const link = document.createElement("a");
        link.href = url;
        link.download = `${templateSelecionado.nome}.${templateSelecionado.formato_saida}`;
        link.click();
      }
      toast({ title: "Sucesso", description: "Documento gerado com sucesso" });
      setGerarDialogOpen(false);
      setValoresVariaveis({});
    } catch {
      toast({ title: "Erro", description: "Falha ao gerar documento", variant: "destructive" });
    }
  };

  const abrirGerarDialog = (template: Template) => {
    setTemplateSelecionado(template);
    const valores: Record<string, string> = {};
    template.variaveis.forEach(v => { valores[v] = ""; });
    setValoresVariaveis(valores);
    setGerarDialogOpen(true);
  };

  const inserirVariavel = (variavel: string) => {
    setForm({ ...form, conteudo: (form.conteudo || "") + variavel });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2"><FileTemplate className="h-5 w-5" />Templates de Documentos</CardTitle>
        {!modoVisualizacao && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-2" />Novo Template</Button></DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
              <DialogHeader><DialogTitle>{editando ? "Editar Template" : "Novo Template"}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Nome</Label><Input value={form.nome || ""} onChange={e => setForm({ ...form, nome: e.target.value })} /></div>
                  <div><Label>Tipo</Label>
                    <Select value={form.tipo} onValueChange={v => setForm({ ...form, tipo: v as Template["tipo"] })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{tiposTemplate.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label>Descrição</Label><Input value={form.descricao || ""} onChange={e => setForm({ ...form, descricao: e.target.value })} /></div>
                <div>
                  <Label>Variáveis Disponíveis</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {variaveisComuns.map(v => <Badge key={v} variant="outline" className="cursor-pointer hover:bg-muted" onClick={() => inserirVariavel(v)}>{v}</Badge>)}
                  </div>
                </div>
                <div><Label>Conteúdo do Template</Label><Textarea value={form.conteudo || ""} onChange={e => handleConteudoChange(e.target.value)} rows={12} className="font-mono text-sm" /></div>
                {form.variaveis && form.variaveis.length > 0 && (
                  <div><Label>Variáveis Detectadas</Label><div className="flex flex-wrap gap-1 mt-1">{form.variaveis.map(v => <Badge key={v}><Variable className="h-3 w-3 mr-1" />{v}</Badge>)}</div></div>
                )}
                <div><Label>Formato de Saída</Label>
                  <Select value={form.formato_saida} onValueChange={v => setForm({ ...form, formato_saida: v as Template["formato_saida"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="pdf">PDF</SelectItem><SelectItem value="docx">Word (DOCX)</SelectItem><SelectItem value="html">HTML</SelectItem></SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSubmit} className="w-full">{editando ? "Salvar Alterações" : "Criar Template"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {templates.map(template => (
          <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <FileTemplate className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium">{template.nome}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary">{tiposTemplate.find(t => t.value === template.tipo)?.label}</Badge>
                  <Badge variant="outline">{template.formato_saida.toUpperCase()}</Badge>
                  <span>{template.variaveis.length} variáveis</span>
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => abrirGerarDialog(template)}><Download className="h-4 w-4" /></Button>
              {!modoVisualizacao && (
                <>
                  <Button variant="ghost" size="icon" onClick={() => onDuplicar?.(template.id)}><Copy className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEditar(template)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => onExcluir?.(template.id)}><Trash2 className="h-4 w-4" /></Button>
                </>
              )}
            </div>
          </div>
        ))}

        {/* Dialog para Gerar Documento */}
        <Dialog open={gerarDialogOpen} onOpenChange={setGerarDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Gerar Documento: {templateSelecionado?.nome}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              {templateSelecionado?.variaveis.map(variavel => (
                <div key={variavel}><Label>{variavel.replace(/[{}]/g, "")}</Label><Input value={valoresVariaveis[variavel] || ""} onChange={e => setValoresVariaveis({ ...valoresVariaveis, [variavel]: e.target.value })} /></div>
              ))}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onPreview?.(templateSelecionado!.id, valoresVariaveis)} className="flex-1"><Eye className="h-4 w-4 mr-2" />Pré-visualizar</Button>
                <Button onClick={handleGerar} className="flex-1"><Download className="h-4 w-4 mr-2" />Gerar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {templates.length === 0 && <p className="text-center text-muted-foreground py-4">Nenhum template cadastrado</p>}
      </CardContent>
    </Card>
  );
}

export default DocumentoTemplate;
