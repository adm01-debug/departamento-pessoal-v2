import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DependenteCardProps {
  data?: any[];
  onAction?: (action: string, item?: any) => void;
}

export const DependenteCard: React.FC<DependenteCardProps> = ({ data = [], onAction }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>DependenteCard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.length === 0 ? (
            <p className="text-muted-foreground">Nenhum dependente cadastrado</p>
          ) : (
            data.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <p>{item.nome || 'Dependente'}</p>
              </div>
            ))
          )}
          <Button onClick={() => onAction?.('add')}>Adicionar Dependente</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DependenteCard;
