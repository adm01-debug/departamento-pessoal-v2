import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyList } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { documentoService } from '@/services';
import { FileText, Upload, Download, Eye, Trash2, Loader2, File } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const BUCKET = 'documentos';
const TIPOS_DOCUMENTO = ['Contrato', 'Atestado', 'Holerite', 'Certificado', 'RG', 'CPF', 'CTPS', 'Comprovante', 'Outro'];

export default function DocumentosPage() {
  const [search, setSearch] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tipo, setTipo] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: documentos, isLoading } = useQuery({
    queryKey: ['documentos'],
    queryFn: () => documentoService.listar(),
  });

  const deleteMutation = useMutation({
    mutationFn: async (doc: any) => {
      // Delete from storage if url exists
      if (doc.url) {
        const path = doc.url.split(`${BUCKET}/`).pop();
        if (path) await supabase.storage.from(BUCKET).remove([path]);
      }
      await documentoService.excluir(doc.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos'] });
      toast.success('Documento excluído');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleUpload = async () => {
    if (!file || !tipo) {
      toast.error('Selecione um arquivo e tipo');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Arquivo deve ter no máximo 10MB');
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const storagePath = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

      const { error: uploadErr } = await supabase.storage.from(BUCKET).upload(storagePath, file);
      if (uploadErr) throw uploadErr;

      // Get signed URL (private bucket)
      const { data: urlData } = await supabase.storage.from(BUCKET).createSignedUrl(storagePath, 60 * 60 * 24 * 365);

      await documentoService.criar({
        nome: file.name,
        nome_arquivo: file.name,
        tipo,
        url: urlData?.signedUrl || storagePath,
        tamanho: file.size,
        mime_type: file.type,
        storage_path: storagePath,
      });

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

  const handleDownload = async (doc: any) => {
    try {
      const path = doc.storage_path || doc.url?.split(`${BUCKET}/`).pop();
      if (!path) { toast.error('Arquivo não encontrado'); return; }

      const { data, error } = await supabase.storage.from(BUCKET).download(path);
      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.nome_arquivo || doc.nome || 'documento';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleView = async (doc: any) => {
    try {
      const path = doc.storage_path || doc.url?.split(`${BUCKET}/`).pop();
      if (!path) { toast.error('Arquivo não encontrado'); return; }

      const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600);
      if (error) throw error;
      window.open(data.signedUrl, '_blank');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filtered = documentos?.filter((d: any) =>
    !search || (d.nome || d.nome_arquivo || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageLayout
      title="Documentos"
      description="Gestão de documentos dos colaboradores"
      icon={<FileText className="h-5 w-5 text-primary-foreground" />}
      gradient="from-warning to-primary"
      actions={
        <Button onClick={() => setShowUpload(true)} className="rounded-xl bg-gradient-to-r from-warning to-primary hover:opacity-90 shadow-lg font-body">
          <Upload className="h-4 w-4 mr-2" />Upload
        </Button>
      }
    >
      <DataTableToolbar search={search} onSearchChange={setSearch} searchPlaceholder="Buscar documento..." />

      {isLoading ? (
        <div className="flex justify-center p-8"><Spinner size="lg" /></div>
      ) : !filtered?.length ? (
        <EmptyList entityName="documento" />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border/30 overflow-hidden shadow-elevated">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-display font-semibold">Nome</TableHead>
                <TableHead className="font-display font-semibold">Tipo</TableHead>
                <TableHead className="font-display font-semibold">Tamanho</TableHead>
                <TableHead className="font-display font-semibold">Data</TableHead>
                <TableHead className="w-[140px] font-display font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((doc: any) => (
                <TableRow key={doc.id} className="hover:bg-accent/30 transition-colors">
                  <TableCell className="font-body font-medium flex items-center gap-2">
                    <File className="h-4 w-4 text-muted-foreground shrink-0" />
                    {doc.nome || doc.nome_arquivo || '-'}
                  </TableCell>
                  <TableCell><Badge className="bg-info/15 text-info border-0 font-body">{doc.tipo || '-'}</Badge></TableCell>
                  <TableCell className="font-body text-muted-foreground">{formatSize(doc.tamanho)}</TableCell>
                  <TableCell className="font-body">{doc.created_at ? new Date(doc.created_at).toLocaleDateString('pt-BR') : '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="rounded-xl hover:bg-info/10" onClick={() => handleView(doc)} title="Visualizar">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-xl hover:bg-success/10" onClick={() => handleDownload(doc)} title="Download">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-xl hover:bg-destructive/10" onClick={() => deleteMutation.mutate(doc)} title="Excluir">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">Enviar Documento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-body">Tipo de Documento</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                <SelectContent>
                  {TIPOS_DOCUMENTO.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-body">Arquivo</Label>
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-border/50 rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
              >
                {file ? (
                  <div className="flex items-center justify-center gap-2">
                    <File className="h-5 w-5 text-primary" />
                    <span className="font-body text-sm">{file.name} ({formatSize(file.size)})</span>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="font-body text-sm text-muted-foreground">Clique para selecionar um arquivo</p>
                    <p className="font-body text-xs text-muted-foreground/60 mt-1">Máximo 10MB</p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpload(false)} className="rounded-xl font-body">Cancelar</Button>
            <Button onClick={handleUpload} disabled={uploading || !file || !tipo} className="rounded-xl bg-gradient-to-r from-primary to-primary-glow font-body">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
