import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ESocialEvento {
  id: string;
  evento: string;
  status: string;
  data: string;
}

interface ESocialListProps {
  eventos?: ESocialEvento[];
}

export function ESocialList({ eventos = [] }: ESocialListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Eventos eSocial</CardTitle>
      </CardHeader>
      <CardContent>
        {eventos.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Nenhum evento encontrado</p>
        ) : (
          <div className="space-y-2">
            {eventos.map((evento) => (
              <div key={evento.id} className="p-3 border rounded-lg">
                <p className="font-medium">{evento.evento}</p>
                <p className="text-sm text-muted-foreground">{evento.status} - {evento.data}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ESocialList;
