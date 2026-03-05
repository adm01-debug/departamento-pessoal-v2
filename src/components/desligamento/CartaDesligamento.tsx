// @ts-nocheck
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props {
  colaborador: { nome: string; cpf: string; cargo: string };
  empresa: { razao_social: string; cnpj: string };
  data_desligamento: string;
  motivo: string;
}

function CartaDesligamento({ colaborador, empresa, data_desligamento, motivo }: Props) {
  const gerar = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('CARTA DE DESLIGAMENTO', 105, 20, { align: 'center' });
    doc.setFontSize(11);
    doc.text(`Prezado(a) ${colaborador.nome},`, 14, 50);
    doc.text(`Comunicamos que seu contrato de trabalho será rescindido a partir de`, 14, 65);
    doc.text(`${format(new Date(data_desligamento), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}.`, 14, 72);
    doc.text(`Motivo: ${motivo}`, 14, 87);
    doc.text(`Solicitamos comparecer ao RH para os procedimentos de rescisão.`, 14, 102);
    doc.text(`${empresa.razao_social}`, 14, 130);
    doc.text(`CNPJ: ${empresa.cnpj}`, 14, 137);
    doc.text('_________________________________', 14, 170);
    doc.text('Recursos Humanos', 14, 177);
    doc.save(`carta-desligamento-${colaborador.nome}.pdf`);
  };

  return <Button onClick={gerar} variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Carta</Button>;
}
export default memo(CartaDesligamento);