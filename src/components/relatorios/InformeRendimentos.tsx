import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface RendimentosData {
  ano: number;
  colaborador: {
    nome: string;
    cpf: string;
    endereco: string;
  };
  empresa: {
    razao_social: string;
    cnpj: string;
    endereco: string;
  };
  rendimentos: {
    salarios: number;
    ferias: number;
    decimoTerceiro: number;
    outros: number;
  };
  deducoes: {
    inss: number;
    irrf: number;
    pensaoAlimenticia: number;
  };
}

function InformeRendimentos({ dados }: { dados: RendimentosData }) {
  const totalRendimentos = 
    dados.rendimentos.salarios + 
    dados.rendimentos.ferias + 
    dados.rendimentos.decimoTerceiro + 
    dados.rendimentos.outros;

  const totalDeducoes = 
    dados.deducoes.inss + 
    dados.deducoes.irrf + 
    dados.deducoes.pensaoAlimenticia;

  const gerarPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('INFORME DE RENDIMENTOS', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Ano-Calendário: ${dados.ano}`, 105, 30, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text('FONTE PAGADORA', 14, 45);
    doc.text(`Nome: ${dados.empresa.razao_social}`, 14, 52);
    doc.text(`CNPJ: ${dados.empresa.cnpj}`, 14, 59);
    
    doc.text('BENEFICIÁRIO', 14, 75);
    doc.text(`Nome: ${dados.colaborador.nome}`, 14, 82);
    doc.text(`CPF: ${dados.colaborador.cpf}`, 14, 89);
    
    autoTable(doc, {
      startY: 100,
      head: [['RENDIMENTOS TRIBUTÁVEIS', 'VALOR (R$)']],
      body: [
        ['Salários', dados.rendimentos.salarios.toLocaleString('pt-BR', { minimumFractionDigits: 2 })],
        ['Férias', dados.rendimentos.ferias.toLocaleString('pt-BR', { minimumFractionDigits: 2 })],
        ['13º Salário', dados.rendimentos.decimoTerceiro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })],
        ['Outros', dados.rendimentos.outros.toLocaleString('pt-BR', { minimumFractionDigits: 2 })],
        ['TOTAL', totalRendimentos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })],
      ],
    });
    
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['DEDUÇÕES', 'VALOR (R$)']],
      body: [
        ['INSS', dados.deducoes.inss.toLocaleString('pt-BR', { minimumFractionDigits: 2 })],
        ['IRRF', dados.deducoes.irrf.toLocaleString('pt-BR', { minimumFractionDigits: 2 })],
        ['Pensão Alimentícia', dados.deducoes.pensaoAlimenticia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })],
        ['TOTAL', totalDeducoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })],
      ],
    });
    
    doc.save(`informe-rendimentos-${dados.ano}-${dados.colaborador.cpf}.pdf`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Informe de Rendimentos {dados.ano}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Rendimentos</p>
            <p className="text-2xl font-bold">
              {totalRendimentos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Deduções</p>
            <p className="text-2xl font-bold text-red-500">
              {totalDeducoes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>
        <Button onClick={gerarPDF} className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Baixar PDF
        </Button>
      </CardContent>
    </Card>
  );
}

export default memo(InformeRendimentos);
