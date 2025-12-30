import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';

interface DocumentoDetailsProps {
  nome: string;
  tipo: string;
  dataUpload: string;
  tamanho?: string;
  status?: string;
}

export function DocumentoDetails({ nome, tipo, dataUpload, tamanho, status }: DocumentoDetailsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <FileText className="h-8 w-8 text-muted-foreground" />
        <div>
          <CardTitle>{nome}</CardTitle>
          {status && <Badge variant="secondary">{status}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm"><strong>Tipo:</strong> {tipo}</p>
        <p className="text-sm"><strong>Data de Upload:</strong> {dataUpload}</p>
        {tamanho && <p className="text-sm"><strong>Tamanho:</strong> {tamanho}</p>}
      </CardContent>
    </Card>
  );
}
