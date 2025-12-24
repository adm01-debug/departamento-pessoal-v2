/**
 * @fileoverview Card de aniversariantes do mês no dashboard
 * @module components/dashboard/BirthdayCard
 */
import { memo } from 'react';
import { Cake, Gift } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Aniversariante {
  id: string;
  nome: string;
  data: string;
  foto?: string;
  departamento: string;
}

interface BirthdayCardProps {
  /** Lista de aniversariantes */
  aniversariantes: Aniversariante[];
}

/**
 * Card que exibe os aniversariantes do mês
 * @param props - Propriedades do componente
 * @returns Card com lista de aniversariantes
 */
export const BirthdayCard = memo(function BirthdayCard({ aniversariantes }: BirthdayCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Cake className="h-4 w-4 text-pink-500" />
          Aniversariantes do Mês
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {aniversariantes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum aniversariante este mês
          </p>
        ) : (
          aniversariantes.map((pessoa) => (
            <div key={pessoa.id} className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={pessoa.foto} alt={pessoa.nome} />
                <AvatarFallback className="text-xs">
                  {pessoa.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{pessoa.nome}</p>
                <p className="text-xs text-muted-foreground">{pessoa.data} - {pessoa.departamento}</p>
              </div>
              <Gift className="h-4 w-4 text-pink-400" />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
});

