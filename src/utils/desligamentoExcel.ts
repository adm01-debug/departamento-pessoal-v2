import { toast } from 'sonner';

const TIPO_LABELS: Record<string, string> = {
  sem_justa_causa: 'Sem Justa Causa',
  com_justa_causa: 'Com Justa Causa',
  pedido_demissao: 'Pedido de Demissão',
  acordo_mutuo: 'Acordo Mútuo',
  termino_contrato: 'Término de Contrato',
};

const STATUS_LABELS: Record<string, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em Andamento',
  concluido: 'Concluído',
  finalizado: 'Finalizado',
  cancelado: 'Cancelado',
};

export function exportarDesligamentosExcel(desligamentos: any[]) {
  if (desligamentos.length === 0) {
    toast.error('Nenhum desligamento para exportar');
    return;
  }

  const rows = desligamentos.map((d: any) => ({
    'Colaborador': d.colaborador?.nome_completo || '—',
    'Data Desligamento': d.data_desligamento ? new Date(d.data_desligamento).toLocaleDateString('pt-BR') : '—',
    'Tipo': TIPO_LABELS[d.tipo] || d.tipo || '—',
    'Status': STATUS_LABELS[d.status] || d.status || '—',
    'Motivo': d.motivo || '—',
    'Salário Base': d.salario_base || 0,
    'Valor Líquido': d.valor_liquido || 0,
    'Aviso Prévio': d.data_aviso_previo ? new Date(d.data_aviso_previo).toLocaleDateString('pt-BR') : '—',
    'Saldo Salário': d.saldo_salario || 0,
    '13º Proporcional': d.decimo_terceiro || 0,
    'Férias Proporcionais': d.ferias_proporcionais || 0,
    'Multa FGTS': d.multa_fgts || 0,
    'Total Proventos': d.total_proventos || 0,
    'Total Descontos': d.total_descontos || 0,
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Desligamentos');

  // Auto-width columns
  const colWidths = Object.keys(rows[0]).map((key) => ({
    wch: Math.max(key.length, ...rows.map((r: any) => String(r[key]).length)) + 2,
  }));
  ws['!cols'] = colWidths;

  XLSX.writeFile(wb, `Desligamentos_${new Date().toISOString().slice(0, 10)}.xlsx`);
  toast.success('Planilha exportada com sucesso!');
}
