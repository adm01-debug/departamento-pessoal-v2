import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, FileText, Clock } from 'lucide-react';

interface Documento {
  id: string;
  nome: string;
  obrigatorio: boolean;
  status: 'pendente' | 'enviado' | 'validado' | 'rejeitado';
}

interface AdmissaoChecklistProps {
  documentos: Documento[];
  onToggleStatus?: (docId: string) => void;
}

export function AdmissaoChecklist({ documentos, onToggleStatus }: AdmissaoChecklistProps) {
  const total = documentos.length;
  const concluidos = documentos.filter(d => d.status === 'validado' || d.status === 'enviado').length;
  const progresso = total > 0 ? (concluidos / total) * 100 : 0;

  return (
    <Card className="border-border/40 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-display flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            Checklist de Documentos
          </CardTitle>
          <Badge variant="outline" className="text-[10px]">
            {concluidos}/{total}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {documentos.map((doc) => (
            <div key={doc.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <Checkbox 
                checked={doc.status === 'validado'} 
                onCheckedChange={() => onToggleStatus?.(doc.id)}
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-body">{doc.nome}</span>
                  {doc.obrigatorio && <span className="text-[10px] text-destructive font-medium">Obrigatório</span>}
                </div>
                <div className="flex items-center gap-2">
                  {doc.status === 'pendente' && (
                    <span className="flex items-center gap-1 text-[10px] text-warning font-medium">
                      <Clock className="w-3 h-3" /> Pendente
                    </span>
                  )}
                  {doc.status === 'enviado' && (
                    <span className="flex items-center gap-1 text-[10px] text-info font-medium">
                      <FileText className="w-3 h-3" /> Enviado
                    </span>
                  )}
                  {doc.status === 'validado' && (
                    <span className="flex items-center gap-1 text-[10px] text-success font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Validado
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
