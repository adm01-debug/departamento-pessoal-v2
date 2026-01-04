import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Copy, Edit, Trash2, Plus, Eye } from "lucide-react";

interface CampoTemplate {
  id: string;
  nome: string;
  tipo: "texto" | "data" | "numero" | "lista" | "colaborador" | "empresa";
  obrigatorio: boolean;
  valorPadrao?: string;
  opcoes?: string[];
}

interface Template {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  conteudo: string;
  campos: CampoTemplate[];
  ativo: boolean;
  criadoPor: string;
  criadoEm: string;
}

interface DocumentoTemplateProps {
  templates: Template[];
  onGerarDocumento: (templateId: string, dados: Record<string, string>) => void;
  onEditar?: (template: Template) => void;
  onExcluir?: (templateId: string) => void;
  onDuplicar?: (templateId: string) => void;
  readOnly?: boolean;
}

export function DocumentoTemplate({
  templates,
  onGerarDocumento,
  onEditar,
  onExcluir,
  onDuplicar,
  readOnly = false
}: DocumentoTemplateProps) {
  const [templateSelecionado, setTemplateSelecionado] = useState<Template | null>(null);
  const [dadosCampos, setDadosCampos] = useState<Record<string, string>>({});
  const [previewMode, setPreviewMode] = useState(false);

  const handleSelecionar = (template: Template) => {
    setTemplateSelecionado(template);
    const valoresPadrao: Record<string, string> = {};
    template.campos.forEach(campo => {
      if (campo.valorPadrao) valoresPadrao[campo.id] = campo.valorPadrao;
    });
    setDadosCampos(valoresPadrao);
  };

  const handleCampoChange = (campoId: string, valor: string) => {
    setDadosCampos(prev => ({ ...prev, [campoId]: valor }));
  };

  const handleGerar = () => {
    if (!templateSelecionado) return;
    onGerarDocumento(templateSelecionado.id, dadosCampos);
  };

  const substituirVariaveis = (conteudo: string): string => {
    let resultado = conteudo;
    Object.entries(dadosCampos).forEach(([id, valor]) => {
      resultado = resultado.replace(new RegExp(`{{${id}}}`, "g"), valor || `[${id}]`);
    });
    return resultado;
  };

  const renderCampo = (campo: CampoTemplate) => {
    switch (campo.tipo) {
      case "lista":
        return (
          <Select value={dadosCampos[campo.id] || ""} onValueChange={(v) => handleCampoChange(campo.id, v)}>
            <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
            <SelectContent>
              {campo.opcoes?.map(op => <SelectItem key={op} value={op}>{op}</SelectItem>)}
            </SelectContent>
          </Select>
        );
      case "data":
        return <Input type="date" value={dadosCampos[campo.id] || ""} onChange={(e) => handleCampoChange(campo.id, e.target.value)} />;
      case "numero":
        return <Input type="number" value={dadosCampos[campo.id] || ""} onChange={(e) => handleCampoChange(campo.id, e.target.value)} />;
      default:
        return <Input value={dadosCampos[campo.id] || ""} onChange={(e) => handleCampoChange(campo.id, e.target.value)} />;
    }
  };

  if (templateSelecionado) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{templateSelecionado.nome}</span>
            <Button variant="ghost" size="sm" onClick={() => setTemplateSelecionado(null)}>Voltar</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {previewMode ? (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-white whitespace-pre-wrap font-mono text-sm">
                {substituirVariaveis(templateSelecionado.conteudo)}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setPreviewMode(false)}>Editar Campos</Button>
                <Button onClick={handleGerar}><Download className="h-4 w-4 mr-2" />Gerar Documento</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {templateSelecionado.campos.map(campo => (
                <div key={campo.id}>
                  <Label>{campo.nome} {campo.obrigatorio && <span className="text-red-500">*</span>}</Label>
                  {renderCampo(campo)}
                </div>
              ))}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setPreviewMode(true)}><Eye className="h-4 w-4 mr-2" />Visualizar</Button>
                <Button onClick={handleGerar}><Download className="h-4 w-4 mr-2" />Gerar Documento</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {templates.map(template => (
        <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleSelecionar(template)}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {template.nome}
            </CardTitle>
            <Badge variant="secondary">{template.categoria}</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">{template.descricao}</p>
            <p className="text-xs text-muted-foreground">{template.campos.length} campo(s)</p>
            {!readOnly && (
              <div className="flex gap-1 mt-3" onClick={(e) => e.stopPropagation()}>
                {onEditar && <Button variant="ghost" size="icon" onClick={() => onEditar(template)}><Edit className="h-4 w-4" /></Button>}
                {onDuplicar && <Button variant="ghost" size="icon" onClick={() => onDuplicar(template.id)}><Copy className="h-4 w-4" /></Button>}
                {onExcluir && <Button variant="ghost" size="icon" onClick={() => onExcluir(template.id)}><Trash2 className="h-4 w-4" /></Button>}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export type { Template, CampoTemplate };
export default DocumentoTemplate;
