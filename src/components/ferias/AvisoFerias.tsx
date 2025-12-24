import { memo, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Calendar } from 'lucide-react';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FeriasData {
  colaborador: { nome: string; cpf: string; cargo: string; departamento: string };
  empresa: { razao_social: string; cnpj: string };
  periodoAquisitivo: { inicio: string; fim: string };
  periodoGozo: { inicio: string; fim: string };
  diasGozo: number;
  abonoPecuniario: boolean;
  diasAbono: number;
}

function AvisoFerias({ dados }: { dados: FeriasData }) {
  const gerarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('AVISO DE FÉRIAS', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`${dados.empresa.razao_social}`, 14, 40);
    doc.text(`CNPJ: ${dados.empresa.cnpj}`, 14, 47);
    doc.text('COMUNICADO', 105, 65, { align: 'center' });
    doc.text(`Comunicamos ao(à) Sr(a). ${dados.colaborador.nome},`, 14, 80);
    doc.text(`portador(a) do CPF ${dados.colaborador.cpf}, ocupante do cargo de`, 14, 87);
    doc.text(`${dados.colaborador.cargo}, no departamento ${dados.colaborador.departamento},`, 14, 94);
    doc.text('que suas férias referentes ao período aquisitivo de', 14, 101);
    doc.text(`${dados.periodoAquisitivo.inicio} a ${dados.periodoAquisitivo.fim}`, 14, 108);
    doc.text(`serão gozadas no período de ${dados.periodoGozo.inicio} a ${dados.periodoGozo.fim},`, 14, 115);
    doc.text(`totalizando ${dados.diasGozo} dias.`, 14, 122);
    if (dados.abonoPecuniario) {
      doc.text(`Foi solicitado abono pecuniário de ${dados.diasAbono} dias.`, 14, 136);
    }
    doc.text(`Data: ${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`, 14, 160);
    doc.text('_________________________________', 14, 190);
    doc.text('Empregador', 14, 197);
    doc.text('_________________________________', 120, 190);
    doc.text('Colaborador - Ciente', 120, 197);
    doc.save(`aviso-ferias-${dados.colaborador.nome.replace(/\s/g, '-')}.pdf`);
  };

  return (
    <Button onClick={gerarPDF} variant="outline" size="sm">
      <Calendar className="mr-2 h-4 w-4" />
      Aviso de Férias
    </Button>
  );
}

export default memo(AvisoFerias);

