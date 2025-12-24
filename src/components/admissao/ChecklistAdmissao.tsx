import { memo, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { CheckCircle } from 'lucide-react';

const itensChecklist = [
  { id: 1, item: 'Documentos pessoais (RG, CPF, CNH)', categoria: 'documentos' },
  { id: 2, item: 'CTPS Digital', categoria: 'documentos' },
  { id: 3, item: 'Comprovante de residência', categoria: 'documentos' },
  { id: 4, item: 'Certidão de nascimento/casamento', categoria: 'documentos' },
  { id: 5, item: 'Foto 3x4', categoria: 'documentos' },
  { id: 6, item: 'Exame admissional (ASO)', categoria: 'saude' },
  { id: 7, item: 'Cadastro no ponto eletrônico', categoria: 'sistema' },
  { id: 8, item: 'Criação de email corporativo', categoria: 'sistema' },
  { id: 9, item: 'Acesso aos sistemas', categoria: 'sistema' },
  { id: 10, item: 'Entrega de uniformes/EPIs', categoria: 'materiais' },
  { id: 11, item: 'Cadastro vale-transporte', categoria: 'beneficios' },
  { id: 12, item: 'Cadastro vale-refeição', categoria: 'beneficios' },
  { id: 13, item: 'Assinatura do contrato', categoria: 'contrato' },
  { id: 14, item: 'Registro no eSocial (S-2200)', categoria: 'esocial' },
];

function ChecklistAdmissao({ colaboradorId }: { colaboradorId: string }) {
  const [concluidos, setConcluidos] = useState<number[]>([]);
  const progresso = (concluidos.length / itensChecklist.length) * 100;

  const toggle = (id: number) => {
    setConcluidos(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Checklist de Admissão
        </CardTitle>
        <Progress value={progresso} className="mt-2" />
        <p className="text-sm text-muted-foreground">{concluidos.length}/{itensChecklist.length} itens</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {itensChecklist.map(item => (
          <div key={item.id} className="flex items-center gap-2">
            <Checkbox checked={concluidos.includes(item.id)} onCheckedChange={() => toggle(item.id)} />
            <span className={concluidos.includes(item.id) ? 'line-through text-muted-foreground' : ''}>{item.item}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default memo(ChecklistAdmissao);



