import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Clock, Upload, FileText, AlertTriangle } from "lucide-react";

interface DocumentoObrigatorioItem {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  prazo?: string;
  status: "pendente" | "enviado" | "aprovado" | "vencido" | "rejeitado";
  dataEnvio?: string;
  motivoRejeicao?: string;
}

interface DocumentoObrigatorioProps {
  colaboradorId: string;
  documentos: DocumentoObrigatorioItem[];
  onUpload: (documentoId: string) => void;
  showProgress?: boolean;
}

const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  pendente: { icon: Clock, color: "bg-yellow-100 text-yellow-700", label: "Pendente" },
  enviado: { icon: FileText, color: "bg-blue-100 text-blue-700", label: "Em análise" },
  aprovado: { icon: CheckCircle, color: "bg-green-100 text-green-700", label: "Aprovado" },
  vencido: { icon: AlertCircle, color: "bg-red-100 text-red-700", label: "Vencido" },
  rejeitado: { icon: AlertTriangle, color: "bg-orange-100 text-orange-700", label: "Rejeitado" }
};

export function DocumentoObrigatorio({
  colaboradorId,
  documentos,
  onUpload,
  showProgress = true
}: DocumentoObrigatorioProps) {
  const total = documentos.length;
  const aprovados = documentos.filter(d => d.status === "aprovado").length;
  const pendentes = documentos.filter(d => d.status === "pendente" || d.status === "rejeitado").length;
  const progresso = total > 0 ? (aprovados / total) * 100 : 0;

  const documentosPorCategoria = documentos.reduce((acc, doc) => {
    if (!acc[doc.categoria]) acc[doc.categoria] = [];
    acc[doc.categoria].push(doc);
    return acc;
  }, {} as Record<string, DocumentoObrigatorioItem[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Documentos Obrigatórios</span>
          {showProgress && (
            <Badge variant={progresso === 100 ? "default" : "secondary"}>
              {aprovados}/{total} completos
            </Badge>
          )}
        </CardTitle>
        {showProgress && (
          <div className="space-y-1">
            <Progress value={progresso} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {pendentes > 0 ? `${pendentes} documento(s) pendente(s)` : "Documentação completa!"}
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(documentosPorCategoria).map(([categoria, docs]) => (
            <div key={categoria}>
              <h4 className="font-medium text-sm text-muted-foreground mb-3">{categoria}</h4>
              <div className="space-y-2">
                {docs.map((doc) => {
                  const config = statusConfig[doc.status];
                  const Icon = config.icon;
                  const precisaAcao = doc.status === "pendente" || doc.status === "rejeitado" || doc.status === "vencido";

                  return (
                    <div
                      key={doc.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        precisaAcao ? "border-yellow-200 bg-yellow-50" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${config.color.split(" ")[1]}`} />
                        <div>
                          <p className="font-medium text-sm">{doc.nome}</p>
                          <p className="text-xs text-muted-foreground">{doc.descricao}</p>
                          {doc.motivoRejeicao && (
                            <p className="text-xs text-red-600 mt-1">Motivo: {doc.motivoRejeicao}</p>
                          )}
                          {doc.prazo && doc.status === "pendente" && (
                            <p className="text-xs text-yellow-600 mt-1">Prazo: {new Date(doc.prazo).toLocaleDateString("pt-BR")}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={config.color}>{config.label}</Badge>
                        {precisaAcao && (
                          <Button size="sm" variant="outline" onClick={() => onUpload(doc.id)}>
                            <Upload className="h-4 w-4 mr-1" />
                            Enviar
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export type { DocumentoObrigatorioItem };
export default DocumentoObrigatorio;
