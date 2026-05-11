import { useState } from 'react';
import { useDocumentosAfastamento } from '@/hooks/useAfastamentos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Upload, Trash2, Download, Eye, Loader2 } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { format } from 'date-fns';

interface AfastamentoDocumentManagerProps {
  afastamentoId: string;
}

export function AfastamentoDocumentManager({ afastamentoId }: AfastamentoDocumentManagerProps) {
  const { documentos, isLoading, upload, isUploading, excluir } = useDocumentosAfastamento(afastamentoId);
  const [file, setFile] = useState<File | null>(null);
  const [tipo, setTipo] = useState('atestado');

  const handleUpload = async () => {
    if (!file) return;
    try {
      await upload({ file, tipo });
      setFile(null);
      // Reset input file
      const input = document.getElementById('file-upload') as HTMLInputElement;
      if (input) input.value = '';
    } catch (error) {
      console.error(error);
    }
  };

  const handleExcluir = async (id: string) => {
    if (confirm('Deseja excluir este documento?')) {
      await excluir(id);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-dashed border-2 bg-muted/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="space-y-2">
              <Label>Tipo de Documento</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="atestado">Atestado Médico</SelectItem>
                  <SelectItem value="laudo">Laudo / Exame</SelectItem>
                  <SelectItem value="pericia">Comprovante de Perícia</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Arquivo</Label>
              <Input 
                id="file-upload"
                type="file" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="cursor-pointer"
              />
            </div>
          </div>
          <Button 
            className="w-full mt-4" 
            disabled={!file || isUploading}
            onClick={handleUpload}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Fazer Upload
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Documentos Anexados ({documentos.length})
        </h4>
        
        {isLoading ? (
          <div className="flex justify-center p-4"><Spinner /></div>
        ) : documentos.length === 0 ? (
          <div className="text-center py-8 border rounded-lg bg-card text-muted-foreground text-sm">
            Nenhum documento anexado.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {documentos.map((doc) => (
              <div 
                key={doc.id} 
                className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium max-w-[200px] truncate" title={doc.nome_arquivo}>
                      {doc.nome_arquivo}
                    </div>
                    <div className="text-[10px] text-muted-foreground flex gap-2">
                      <span className="uppercase">{doc.tipo}</span>
                      <span>•</span>
                      <span>{format(new Date(doc.created_at), 'dd/MM/yyyy HH:mm')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" asChild>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                      <Eye className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleExcluir(doc.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
