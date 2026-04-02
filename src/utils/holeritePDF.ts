import jsPDF from 'jspdf';

interface HoleriteData {
  colaborador_nome: string;
  colaborador_cpf: string;
  colaborador_cargo: string;
  competencia: string;
  salario_base: number;
  total_proventos: number;
  total_descontos: number;
  liquido: number;
  inss: number;
  irrf: number;
  fgts: number;
  horas_extras_valor?: number;
  adicional_noturno?: number;
  vale_transporte?: number;
  vale_refeicao?: number;
  plano_saude?: number;
  outros_proventos?: number;
  outros_descontos?: number;
}

function fmt(v: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

export function gerarPDFHolerite(h: HoleriteData) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pw = doc.internal.pageSize.getWidth();
  let y = 15;

  // Header
  doc.setFillColor(30, 58, 138);
  doc.rect(0, 0, pw, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('DEMONSTRATIVO DE PAGAMENTO', pw / 2, 12, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Competência: ${h.competencia || 'N/A'}`, pw / 2, 22, { align: 'center' });

  y = 40;
  doc.setTextColor(0, 0, 0);

  // Employee info
  doc.setFillColor(245, 245, 245);
  doc.rect(10, y, pw - 20, 20, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('COLABORADOR', 15, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nome: ${h.colaborador_nome}`, 15, y + 12);
  doc.text(`CPF: ${h.colaborador_cpf || '---'}`, 120, y + 12);
  doc.text(`Cargo: ${h.colaborador_cargo || '---'}`, 15, y + 17);

  y += 28;

  // Proventos
  doc.setFillColor(34, 139, 34);
  doc.rect(10, y, pw - 20, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('PROVENTOS', 15, y + 5);
  doc.text('VALOR', pw - 25, y + 5, { align: 'right' });

  y += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');

  const proventos: [string, number][] = [
    ['Salário Base', h.salario_base || 0],
    ['Horas Extras', h.horas_extras_valor || 0],
    ['Adicional Noturno', h.adicional_noturno || 0],
    ['Outros Proventos', h.outros_proventos || 0],
  ];

  for (const [label, val] of proventos) {
    if (val > 0) {
      doc.text(label, 15, y);
      doc.text(fmt(val), pw - 15, y, { align: 'right' });
      y += 6;
    }
  }

  doc.setFont('helvetica', 'bold');
  doc.setDrawColor(200, 200, 200);
  doc.line(10, y, pw - 10, y);
  y += 5;
  doc.text('TOTAL PROVENTOS', 15, y);
  doc.setTextColor(34, 139, 34);
  doc.text(fmt(h.total_proventos), pw - 15, y, { align: 'right' });

  y += 12;

  // Descontos
  doc.setFillColor(220, 53, 69);
  doc.rect(10, y, pw - 20, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('DESCONTOS', 15, y + 5);
  doc.text('VALOR', pw - 25, y + 5, { align: 'right' });

  y += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');

  const descontos: [string, number][] = [
    ['INSS', h.inss || 0],
    ['IRRF', h.irrf || 0],
    ['Vale Transporte', h.vale_transporte || 0],
    ['Vale Refeição', h.vale_refeicao || 0],
    ['Plano de Saúde', h.plano_saude || 0],
    ['Outros Descontos', h.outros_descontos || 0],
  ];

  for (const [label, val] of descontos) {
    if (val > 0) {
      doc.text(label, 15, y);
      doc.text(fmt(val), pw - 15, y, { align: 'right' });
      y += 6;
    }
  }

  doc.setFont('helvetica', 'bold');
  doc.line(10, y, pw - 10, y);
  y += 5;
  doc.text('TOTAL DESCONTOS', 15, y);
  doc.setTextColor(220, 53, 69);
  doc.text(fmt(h.total_descontos), pw - 15, y, { align: 'right' });

  y += 15;

  // Líquido
  doc.setFillColor(30, 58, 138);
  doc.rect(10, y, pw - 20, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('VALOR LÍQUIDO', 15, y + 8);
  doc.text(fmt(h.liquido), pw - 15, y + 8, { align: 'right' });

  y += 20;

  // FGTS info
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Base FGTS: ${fmt(h.total_proventos)} | FGTS do mês: ${fmt(h.fgts || 0)}`, 15, y);

  y += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(10, y, pw - 10, y);
  y += 8;
  doc.text('Documento gerado automaticamente pelo Sistema de Departamento Pessoal', pw / 2, y, { align: 'center' });
  doc.text(`Data de emissão: ${new Date().toLocaleDateString('pt-BR')}`, pw / 2, y + 5, { align: 'center' });

  doc.save(`holerite_${h.colaborador_nome?.replace(/\s+/g, '_')}_${h.competencia || 'periodo'}.pdf`);
}
