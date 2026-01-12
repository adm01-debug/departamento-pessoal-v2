// V17-H051: useBackup Real
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { backupServiceReal } from '@/services/backupService.real';
export function useBackupReal(empresaId: string) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['backups', empresaId], queryFn: () => backupServiceReal.getAll(empresaId), enabled: !!empresaId });
  const criarMutation = useMutation({ mutationFn: () => backupServiceReal.criar(empresaId), onSuccess: () => qc.invalidateQueries({ queryKey: ['backups'] }) });
  const restaurarMutation = useMutation({ mutationFn: backupServiceReal.restaurar });
  return { ...query, criar: criarMutation.mutateAsync, restaurar: restaurarMutation.mutateAsync };
}
export default useBackupReal;
