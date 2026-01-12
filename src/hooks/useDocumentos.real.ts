// V17-H008: useDocumentos Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentoServiceReal } from '@/services/documentoService.real';
export function useDocumentosReal(colaboradorId: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['documentos', colaboradorId], queryFn: () => documentoServiceReal.getByColaborador(colaboradorId), enabled: !!colaboradorId });
  const uploadMutation = useMutation({ mutationFn: ({ file, tipo }: any) => documentoServiceReal.upload(colaboradorId, file, tipo), onSuccess: () => qc.invalidateQueries({ queryKey: ['documentos'] }) });
  const deleteMutation = useMutation({ mutationFn: documentoServiceReal.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ['documentos'] }) });
  return { ...query, upload: uploadMutation.mutateAsync, remove: deleteMutation.mutateAsync, isUploading: uploadMutation.isPending };
}
export default useDocumentosReal;
