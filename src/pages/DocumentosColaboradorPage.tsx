// V15-415
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageLayout } from '@/components/layout';
import { DocumentoList, DocumentoUpload } from '@/components/documento';
import { Spinner } from '@/components/ui/spinner';
import { documentoService } from '@/services';
export default function DocumentosColaboradorPage() {
  const { colaboradorId } = useParams();
  const { data: documentos, isLoading, refetch } = useQuery({ queryKey: ['documentos', colaboradorId], queryFn: () => documentoService.listByColaborador(colaboradorId!), enabled: !!colaboradorId });
  const handleUpload = async (data: { nome: string; tipo: string; arquivo: File }) => { await documentoService.upload({ ...data, colaborador_id: colaboradorId! } as any); refetch(); };
  if (isLoading) return <Spinner size="lg" />;
  return (
    <PageLayout title="Documentos do Colaborador">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2"><DocumentoList documentos={documentos || []} onDownload={(d) => window.open(d.arquivo_url)} /></div>
        <div><DocumentoUpload onUpload={handleUpload} /></div>
      </div>
    </PageLayout>
  );
}
