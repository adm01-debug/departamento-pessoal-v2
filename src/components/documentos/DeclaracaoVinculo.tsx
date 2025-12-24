import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props {
  colaborador: { nome: string; cpf: string; cargo: string; data_admissao: string; salario_base: number };
  empresa: { razao_social: string; cnpj: string; endereco: string };
}

function DeclaracaoVinculo({ colaborador, empresa }: Props) {
  const gerar = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('DECLARAÇÃO DE VÍNCULO EMPREGATÍCIO', 105, 20, { align: 'center' });
    doc.setFontSize(11);
    const texto = `Declaramos para os devidos fins que ${colaborador.nome}, portador(a) do CPF ${colaborador.cpf}, é funcionário(a) desta empresa desde ${format(new Date(colaborador.data_admissao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}, exercendo a função de ${colaborador.cargo}, com remuneração mensal de R$ ${colaborador.salario_base.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`;
    doc.text(texto, 14, 50, { maxWidth: 180 });
    doc.text(`${empresa.razao_social}`, 14, 100);
    doc.text(`CNPJ: ${empresa.cnpj}`, 14, 107);
    doc.text(`${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`, 14, 130);
    doc.text('_________________________________', 14, 160);
    doc.text('Responsável pelo RH', 14, 167);
    doc.save(`declaracao-vinculo-${colaborador.nome}.pdf`);
  };

  return <Button onClick={gerar} variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Declaração</Button>;
}
export default memo(DeclaracaoVinculo);