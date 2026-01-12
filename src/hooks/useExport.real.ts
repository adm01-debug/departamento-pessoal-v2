// V17-H025: useExport Real
import { useMutation } from '@tanstack/react-query';
import { exportServiceReal } from '@/services/exportService.real';
export function useExportReal() {
  const exportarMutation = useMutation({ mutationFn: ({ dados, formato, nomeArquivo }: any) => exportServiceReal.exportar(dados, formato, nomeArquivo) });
  const exportarPDFMutation = useMutation({ mutationFn: ({ dados, template }: any) => exportServiceReal.exportarPDF(dados, template) });
  const exportarExcelMutation = useMutation({ mutationFn: ({ dados, colunas }: any) => exportServiceReal.exportarExcel(dados, colunas) });
  return { exportar: exportarMutation.mutateAsync, exportarPDF: exportarPDFMutation.mutateAsync, exportarExcel: exportarExcelMutation.mutateAsync, isExportando: exportarMutation.isPending };
}
export default useExportReal;
