import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FeriadoDetailsProps {
  data: string;
  descricao: string;
  tipo: string;
  uf?: string;
  cidade?: string;
}

export function FeriadoDetails({ data, descricao, tipo, uf, cidade }: FeriadoDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{descricao}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm"><strong>Data:</strong> {data}</p>
        <Badge>{tipo}</Badge>
        {uf && <p className="text-sm"><strong>UF:</strong> {uf}</p>}
        {cidade && <p className="text-sm"><strong>Cidade:</strong> {cidade}</p>}
      </CardContent>
    </Card>
  );
}

export default FeriadoDetails;
