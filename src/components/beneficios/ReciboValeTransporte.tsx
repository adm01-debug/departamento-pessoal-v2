import { memo, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';

interface VTData {
  colaborador: { nome: string; cpf: string; cargo: string };
  empresa: { razao_social: string; cnpj: string };
  mes: string;
  ano: number;
  valorDiario: number;
  diasUteis: number;
  desconto: number;
}

function ReciboValeTransporte({ dados }: { dados: VTData }) {
  const valorTotal = dados.valorDiario * dados.diasUteis;
  
  const gerarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('RECIBO DE VALE-TRANSPORTE', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Competência: ${dados.mes}/${dados.ano}`, 14, 40);
    doc.text(`Colaborador: ${dados.colaborador.nome}`, 14, 50);
    doc.text(`CPF: ${dados.colaborador.cpf}`, 14, 57);
    doc.text(`Cargo: ${dados.colaborador.cargo}`, 14, 64);
    doc.text(`Empresa: ${dados.empresa.razao_social}`, 14, 80);
    doc.text(`CNPJ: ${dados.empresa.cnpj}`, 14, 87);
    doc.text(`Valor diário: R$ ${dados.valorDiario.toFixed(2)}`, 14, 103);
    doc.text(`Dias úteis: ${dados.diasUteis}`, 14, 110);
    doc.text(`Valor total: R$ ${valorTotal.toFixed(2)}`, 14, 117);
    doc.text(`Desconto (6%): R$ ${dados.desconto.toFixed(2)}`, 14, 124);
    doc.text(`Valor empresa: R$ ${(valorTotal - dados.desconto).toFixed(2)}`, 14, 131);
    doc.text('_________________________________', 14, 160);
    doc.text('Assinatura do colaborador', 14, 167);
    doc.save(`recibo-vt-${dados.mes}-${dados.ano}.pdf`);
  };

  return (
    <Button onClick={gerarPDF} variant="outline" size="sm">
      <Download className="mr-2 h-4 w-4" />
      Recibo VT
    </Button>
  );
}

export default memo(ReciboValeTransporte);