/**
 * @fileoverview Declaração de vínculo empregatício
 * @module components/desligamento/DeclaracaoVinculo
 */
import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Printer } from 'lucide-react';

interface DeclaracaoVinculoProps {
  colaborador: {
    nome: string;
    cpf: string;
    cargo: string;
    dataAdmissao: string;
    dataDesligamento?: string;
  };
  empresa: {
    razaoSocial: string;
    cnpj: string;
    endereco?: string;
  };
  onDownload?: () => void;
  onPrint?: () => void;
}

/**
 * Documento de declaração de vínculo
 */
export const DeclaracaoVinculo = memo(function DeclaracaoVinculo({
  colaborador, empresa, onDownload, onPrint
}: DeclaracaoVinculoProps) {
  const dataAtual = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Declaração de Vínculo Empregatício
        </CardTitle>
        <div className="flex gap-2">
          {onPrint && <Button variant="outline" size="sm" onClick={onPrint}><Printer className="h-4 w-4 mr-1" />Imprimir</Button>}
          {onDownload && <Button size="sm" onClick={onDownload}><Download className="h-4 w-4 mr-1" />Download</Button>}
        </div>
      </CardHeader>
      <CardContent className="prose prose-sm max-w-none">
        <div className="p-6 border rounded-lg bg-white">
          <h2 className="text-center font-bold mb-6">DECLARAÇÃO DE VÍNCULO EMPREGATÍCIO</h2>
          <p className="text-justify leading-relaxed">
            Declaramos para os devidos fins que <strong>{colaborador.nome}</strong>, inscrito(a) no CPF sob o nº <strong>{colaborador.cpf}</strong>, 
            {colaborador.dataDesligamento ? ' manteve' : ' mantém'} vínculo empregatício com <strong>{empresa.razaoSocial}</strong>, 
            inscrita no CNPJ sob o nº <strong>{empresa.cnpj}</strong>, exercendo o cargo de <strong>{colaborador.cargo}</strong>, 
            desde <strong>{colaborador.dataAdmissao}</strong>
            {colaborador.dataDesligamento && <> até <strong>{colaborador.dataDesligamento}</strong></>}.
          </p>
          <p className="text-justify leading-relaxed mt-4">
            Por ser expressão da verdade, firmamos a presente declaração.
          </p>
          <p className="mt-8">{empresa.endereco || 'Local'}, {dataAtual}.</p>
          <div className="mt-12 pt-8 border-t text-center">
            <div className="border-t border-black inline-block px-16 pt-2">
              <p className="font-medium">{empresa.razaoSocial}</p>
              <p className="text-sm">CNPJ: {empresa.cnpj}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
