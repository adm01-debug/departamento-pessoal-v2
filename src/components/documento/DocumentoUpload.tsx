// V15-278: src/components/documento/DocumentoUpload.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormSelect } from '@/components/forms';
import { FileUpload } from '@/components/ui/file-upload';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';

interface DocumentoUploadProps {
  onUpload: (data: { nome: string; tipo: string; arquivo: File }) => Promise<void>;
}

const tipoOptions = [
  { value: 'contrato', label: 'Contrato' },
  { value: 'atestado', label: 'Atestado' },
  { value: 'certificado', label: 'Certificado' },
  { value: 'comprovante', label: 'Comprovante' },
  { value: 'outros', label: 'Outros' },
];

export function DocumentoUpload({ onUpload }: DocumentoUploadProps) {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!nome || !tipo || files.length === 0) return;
    setLoading(true);
    try {
      await onUpload({ nome, tipo, arquivo: files[0] });
      setNome('');
      setTipo('');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5" />Enviar Documento</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <FormField label="Nome do Documento" value={nome} onChange={(e) => setNome(e.target.value)} />
        <FormSelect label="Tipo" options={tipoOptions} value={tipo} onChange={setTipo} />
        <FileUpload accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onUpload={setFiles} />
        <Button onClick={handleSubmit} disabled={loading || !nome || !tipo || files.length === 0} className="w-full">
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
          Enviar
        </Button>
      </CardContent>
    </Card>
  );
}
