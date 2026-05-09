import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, DollarSign, PenTool, Upload, ChevronRight, CheckCircle2, AlertCircle, File, Loader2, Download, Eye, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentoService } from '@/services';
import { supabase } from '@/integrations/supabase/client';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';

const BUCKET = 'documentos';
const TIPOS_DOCUMENTO = ['Atestado', 'Certificado', 'Comprovante', 'Contrato', 'RG', 'CPF', 'Outro'];

interface PortalDocumentosTabProps {
  navigate: (path: string) => void;
  colaboradorId?: string;
}

export function PortalDocumentosTab({ navigate, colaboradorId }: PortalDocumentosTabProps) {
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tipo, setTipo] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: documentos, isLoading } = useQuery({
    queryKey: ['portal-documentos', colaboradorId],
    queryFn: () => documentoService.listar(colaboradorId),
    enabled: !!colaboradorId
  });

  const handleUpload = async () => {
    if (!file || !tipo || !colaboradorId) {
      toast.error('Selecione um arquivo e tipo');
      return;
    }
    
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const storagePath = `colaborador_${colaboradorId}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

      const { error: uploadErr } = await supabase.storage.from(BUCKET).upload(storagePath, file);
      if (uploadErr) throw uploadErr;

      const { data: urlData } = await supabase.storage.from(BUCKET).createSignedUrl(storagePath, 60 * 60 * 24 * 365);

      await documentoService.criar({
        nome: file.name,
        nome_arquivo: file.name,
        tipo,
        url: urlData?.signedUrl || storagePath,
        tamanho: file.size,
        mime_type: file.type,
        storage_path: storagePath,
        colaborador_id: colaboradorId
      });

      queryClient.invalidateQueries({ queryKey: ['portal-documentos'] });
      queryClient.invalidateQueries({ queryKey: ['documentos'] });
      toast.success('Documento enviado com sucesso');
      setShowUpload(false);
      setFile(null);
      setTipo('');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: async (doc: any) => {
      if (doc.storage_path) {
        await supabase.storage.from(BUCKET).remove([doc.storage_path]);
      }
      await documentoService.excluir(doc.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-documentos'] });
      toast.success('Documento removido');
    }
  });

  const handleDownload = async (doc: any) => {
    try {
      const path = doc.storage_path || doc.url?.split(`${BUCKET}/`).pop();
      if (!path) return;
      const { data, error } = await supabase.storage.from(BUCKET).download(path);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.nome_arquivo || doc.nome || 'documento';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      toast.error('Erro ao baixar arquivo');
    }
  };

  const quickLinks = [
    { label: 'Documentos Pessoais', path: '/documentos', icon: FileText, desc: 'Consulte seus documentos' },
    { label: 'Assinar Docs', path: '/assinaturas', icon: PenTool, desc: 'Pendências de assinatura' },
    { label: 'Holerites', path: '/holerites', icon: DollarSign, desc: 'Seus contracheques' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-h3 font-display font-bold">Meus Documentos</h2>
        <Button variant="outline" size="sm" className="rounded-xl" onClick={() => navigate('/documentos')}>
          <Upload className="h-4 w-4 mr-1" />Enviar Documento
        </Button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map(({ label, path, icon: Icon, desc }) => (
          <Card key={path} className="border border-border/30 rounded-xl cursor-pointer hover:shadow-elevated transition-all" onClick={() => navigate(path)}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-warning to-warning/70"><Icon className="h-4 w-4 text-primary-foreground" /></div>
              <div className="flex-1">
                <p className="font-display font-semibold text-sm">{label}</p>
                <p className="text-xs text-muted-foreground font-body">{desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
