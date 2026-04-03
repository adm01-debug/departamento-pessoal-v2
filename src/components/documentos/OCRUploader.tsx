import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { edgeFunctionsService } from '@/services/edgeFunctionsService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ScanLine, Upload, Loader2, FileText, Copy } from 'lucide-react';

interface OCRUploaderProps {
  onTextExtracted?: (text: string, docType: string) => void;
}

export function OCRUploader({ onTextExtracted }: OCRUploaderProps) {
  const [docType, setDocType] = useState<string>('generic');
  const [loading, setLoading] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [fileName, setFileName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setLoading(true);
    setExtractedText('');

    try {
      // Upload to storage
      const path = `ocr/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from('documentos').upload(path, file);
      if (uploadError) throw uploadError;

      // Call OCR
      const result = await edgeFunctionsService.ocrDocumento({
        bucket: 'documentos',
        filePath: path,
        documentType: docType as any,
      });

      if (result.success && result.extractedText) {
        setExtractedText(result.extractedText);
        onTextExtracted?.(result.extractedText, docType);
        toast.success('Texto extraído com sucesso!');
      } else {
        throw new Error(result.error || 'Nenhum texto extraído');
      }
    } catch (err: any) {
      toast.error(`Erro no OCR: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(extractedText);
    toast.success('Texto copiado!');
  };

  return (
    <Card className="border border-border/30 shadow-elevated rounded-2xl overflow-hidden">
      <div className="h-[2px] bg-gradient-to-r from-primary to-primary-glow" />
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <ScanLine className="h-5 w-5" /> OCR de Documentos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="font-body">Tipo de Documento</Label>
          <Select value={docType} onValueChange={setDocType}>
            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="generic">Genérico</SelectItem>
              <SelectItem value="cpf">CPF</SelectItem>
              <SelectItem value="rg">RG</SelectItem>
              <SelectItem value="ctps">CTPS</SelectItem>
              <SelectItem value="comprovante_endereco">Comprovante de Endereço</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <input type="file" ref={fileRef} onChange={handleUpload} accept="image/*,.pdf" className="hidden" />
        <Button
          onClick={() => fileRef.current?.click()}
          disabled={loading}
          variant="outline"
          className="w-full rounded-xl h-20 border-dashed border-2 font-body"
        >
          {loading ? (
            <><Loader2 className="h-5 w-5 animate-spin mr-2" />Processando OCR...</>
          ) : (
            <><Upload className="h-5 w-5 mr-2" />{fileName || 'Enviar imagem do documento'}</>
          )}
        </Button>

        {extractedText && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="font-body flex items-center gap-1"><FileText className="h-4 w-4" /> Texto Extraído</Label>
              <Button variant="ghost" size="sm" onClick={copyText} className="gap-1 font-body">
                <Copy className="h-3 w-3" />Copiar
              </Button>
            </div>
            <Textarea value={extractedText} readOnly className="rounded-xl min-h-[120px] text-sm font-mono" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
