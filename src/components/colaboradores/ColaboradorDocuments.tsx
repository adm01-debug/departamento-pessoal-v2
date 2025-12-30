import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface Documento {
  id: string;
  nome: string;
  tipo: string;
  dataUpload?: string;
}

interface ColaboradorDocumentsProps {
  documentos?: Documento[];
  className?: string;
}

export const ColaboradorDocuments = memo(function ColaboradorDocuments({ 
  documentos = [],
  className 
}: ColaboradorDocumentsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Documentos</CardTitle>
      </CardHeader>
      <CardContent>
        {documentos.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">Nenhum documento</p>
        ) : (
          <div className="space-y-2">
            {documentos.map((doc) => (
              <div key={doc.id} className="flex items-center gap-2 p-2 border rounded">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>{doc.nome}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export default ColaboradorDocuments;
