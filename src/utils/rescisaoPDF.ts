import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'sonner';
import { RescisaoResult, fmt } from './rescisaoCalc';

export function gerarPDFRescisao(form: any, result: RescisaoResult) {
  const doc = new jsPDF();
  const pw = doc.internal.pageSize.getWidth();
  let y = 20;

  doc.setFontSize(14); doc.setFont('helvetica', 'bold');
  doc.text('TERMO DE RESCISÃO DO CONTRATO DE TRABALHO', pw / 2, y, { align: 'center' }); y += 12;

  doc.setFontSize(10); doc.setFont('helvetica', 'normal');
  doc.text(`Colaborador: ${form.nomeColaborador || '—'}`, 14, y); y += 6;
  doc.text(`CPF: ${form.cpf || '—'}`, 14, y); y += 6;
  doc.text(`Cargo: ${form.cargo || '—'}`, 14, y); y += 6;
  doc.text(`Admissão: ${form.dataAdmissao ? new Date(form.dataAdmissao).toLocaleDateString('pt-BR') : '—'}`, 14, y);
  doc.text(`Desligamento: ${form.dataDesligamento ? new Date(form.dataDesligamento).toLocaleDateString('pt-BR') : '—'}`, 110, y); y += 6;
  doc.text(`Tipo: ${form.tipo === 'sem_justa_causa' ? 'Sem Justa Causa' : form.tipo === 'justa_causa' ? 'Justa Causa' : 'Pedido de Demissão'}`, 14, y); y += 10;

  (doc as any).autoTable({
    startY: y,
    head: [['Verba', 'Referência', 'Valor (R$)']],
    body: [
      ['Saldo de Salário', `${result.diasTrabalhados} dias`, fmt(result.saldoSalario)],
      ['Aviso Prévio Indenizado', `${result.diasAviso} dias`, fmt(result.avisoIndenizado)],
      ['Férias Vencidas', result.feriasVencidas > 0 ? '30 dias' : '—', fmt(result.feriasVencidas)],
      ['Férias Proporcionais', `${result.mesesFerias}/12 avos`, fmt(result.feriasProporcionais)],
      ['1/3 Constitucional', '', fmt(result.tercoFerias)],
      ['13º Proporcional', `${result.meses13}/12 avos`, fmt(result.decimoTerceiro)],
      ['', 'TOTAL PROVENTOS', fmt(result.totalProventos)],
      ['INSS', '', `(${fmt(result.inss)})`],
      ['IRRF', '', `(${fmt(result.irrf)})`],
      ['', 'TOTAL DESCONTOS', `(${fmt(result.totalDescontos)})`],
      ['Multa FGTS (40%)', '', fmt(result.multaFGTS)],
      ['FGTS s/ Rescisão', '', fmt(result.fgtsRescisao)],
      ['', 'VALOR LÍQUIDO', fmt(result.totalLiquido)],
    ],
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 9 },
  });

  y = (doc as any).lastAutoTable.finalY + 20;
  const hoje = new Date().toLocaleDateString('pt-BR');
  doc.text(`Data: ${hoje}`, pw / 2, y, { align: 'center' }); y += 20;
  doc.line(14, y, 90, y); doc.line(pw - 90, y, pw - 14, y); y += 5;
  doc.setFontSize(9);
  doc.text('EMPREGADOR', 52, y, { align: 'center' });
  doc.text('EMPREGADO(A)', pw - 52, y, { align: 'center' });

  doc.save(`TRCT_${(form.nomeColaborador || 'rescisao').replace(/\s/g, '_')}.pdf`);
  toast.success('TRCT gerado com sucesso!');
}
