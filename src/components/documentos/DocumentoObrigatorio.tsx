import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Clock, Upload, FileWarning, AlertCircle } from "lucide-react";

interface DocumentoObrigatorioItem {
  id: string;
  tipo: string;
  nome: string;
  descricao?: string;
  categoria: string;
  status: "pendente" | "enviado" | "aprovado" | "rejeitado" | "vencido" | "vencendo";
  data_limite?: string;
  data_envio?: string;
  dias_restantes?: number;
  motivo_rejeicao?: string;
}

interface DocumentoObrigatorioProps {
  colaboradorId: string;
  colaboradorNome: string;
  documentos: DocumentoObrigatorioItem[];
  onUpload?: (tipo: string) => void;
  onVisualizarDetalhes?: (documento: DocumentoObrigatorioItem) => void;
}

const statusConfig = {
  pendente: { label: "Pendente", color: "bg-yellow-500", icon: Clock },
  enviado: { label: "Em Análise", color: "bg-blue-500", icon: Clock },
  aprovado: { label: "Aprovado", color: "bg-green-500", icon: CheckCircle },
  rejeitado: { label: "Rejeitado", color: "bg-red-500", icon: AlertCircle },
  vencido: { label: "Vencido", color: "bg-red-600", icon: AlertTriangle },
  vencendo: { label: "Vencendo", color: "bg-orange-500", icon: FileWarning }
};

export function DocumentoObrigatorio({
  colaboradorId,
  colaboradorNome,
  documentos,
  onUpload,
  onVisualizarDetalhes
}: DocumentoObrigatorioProps) {
  const totalDocumentos = documentos.length;
  const aprovados = documentos.filter(d => d.status === "aprovado").length;
  const pendentes = documentos.filter(d => d.status === "pendente").length;
  const vencidos = documentos.filter(d => d.status === "vencido").length;
  const vencendo = documentos.filter(d => d.status === "vencendo").length;
  
  const percentualCompleto = totalDocumentos > 0 ? (aprovados / totalDocumentos) * 100 : 0;

  const agrupadosPorCategoria = documentos.reduce((acc, doc) => {
    if (!acc[doc.categoria]) acc[doc.categoria] = [];
    acc[doc.categoria].push(doc);
    return acc;
  }, {} as Record<string, DocumentoObrigatorioItem[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Documentos Obrigatórios - {colaboradorNome}</span>
          <div className="flex gap-2">
            {vencidos > 0 && <Badge variant="destructive">{vencidos} vencido(s)</Badge>}
            {vencendo > 0 && <Badge className="bg-orange-500">{vencendo} vencendo</Badge>}
            {pendentes > 0 && <Badge variant="secondary">{pendentes} pendente(s)</Badge>}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resumo */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso da Documentação</span>
            <span className="font-medium">{aprovados}/{totalDocumentos} ({percentualCompleto.toFixed(0)}%)</span>
          </div>
          <Progress value={percentualCompleto} className="h-3" />
        </div>

        {/* Alertas */}
        {(vencidos > 0 || vencendo > 0) && (
          <div className={`p-3 rounded-lg ${vencidos > 0 ? "bg-red-50 border border-red-200" : "bg-orange-50 border border-orange-200"}`}>
            <div className="flex items-center gap-2">
              <AlertTriangle className={`h-5 w-5 ${vencidos > 0 ? "text-red-500" : "text-orange-500"}`} />
              <span className="font-medium">
                {vencidos > 0 
                  ? `${vencidos} documento(s) vencido(s) requer(em) atenção imediata`
                  : `${vencendo} documento(s) próximo(s) do vencimento`
                }
              </span>
            </div>
          </div>
        )}

        {/* Lista por Categoria */}
        {Object.entries(agrupadosPorCategoria).map(([categoria, docs]) => (
          <div key={categoria} className="space-y-3">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">{categoria}</h3>
            <div className="space-y-2">
              {docs.map(doc => {
                const config = statusConfig[doc.status];
                const StatusIcon = config.icon;
                const precisaAcao = ["pendente", "rejeitado", "vencido", "vencendo"].includes(doc.status);

                return (
                  <div 
                    key={doc.id} 
                    className={`flex items-center justify-between p-3 border rounded-lg ${precisaAcao ? "border-l-4 border-l-" + (doc.status === "vencido" ? "red" : doc.status === "vencendo" ? "orange" : "yellow") + "-500" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <StatusIcon className={`h-5 w-5 ${config.color.replace("bg-", "text-")}`} />
                      <div>
                        <p className="font-medium">{doc.nome}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge className={config.color}>{config.label}</Badge>
                          {doc.dias_restantes !== undefined && doc.dias_restantes > 0 && (
                            <span>{doc.dias_restantes} dias restantes</span>
                          )}
                          {doc.data_limite && doc.status === "vencido" && (
                            <span className="text-red-500">Venceu em {new Date(doc.data_limite).toLocaleDateString("pt-BR")}</span>
                          )}
                        </div>
                        {doc.motivo_rejeicao && (
                          <p className="text-sm text-red-500 mt-1">Motivo: {doc.motivo_rejeicao}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {precisaAcao && (
                        <Button size="sm" onClick={() => onUpload?.(doc.tipo)}>
                          <Upload className="h-4 w-4 mr-2" />
                          {doc.status === "rejeitado" ? "Reenviar" : "Enviar"}
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => onVisualizarDetalhes?.(doc)}>
                        Detalhes
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {documentos.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-3" />
            <p className="text-muted-foreground">Nenhum documento obrigatório pendente</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DocumentoObrigatorio;
