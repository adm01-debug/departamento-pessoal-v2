/**
 * @fileoverview Card de status dos colaboradores
 * @module components/dashboard/EmployeeStatusCard
 */
import { memo } from 'react';
import { Users, UserCheck, UserMinus, UserX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatusData {
  ativos: number;
  ferias: number;
  afastados: number;
  desligados: number;
}

interface EmployeeStatusCardProps {
  /** Dados de status dos colaboradores */
  data: StatusData;
}

const statusItems = [
  { key: 'ativos', label: 'Ativos', icon: UserCheck, color: 'text-green-500' },
  { key: 'ferias', label: 'Férias', icon: Users, color: 'text-blue-500' },
  { key: 'afastados', label: 'Afastados', icon: UserMinus, color: 'text-yellow-500' },
  { key: 'desligados', label: 'Desligados', icon: UserX, color: 'text-red-500' },
] as const;

/**
 * Card que exibe resumo de status dos colaboradores
 * @param props - Propriedades do componente
 * @returns Card com contadores de status
 */
export const EmployeeStatusCard = memo(function EmployeeStatusCard({ data }: EmployeeStatusCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Status dos Colaboradores
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {statusItems.map(({ key, label, icon: Icon, color }) => (
            <div key={key} className="flex items-center gap-2">
              <Icon className={`h-4 w-4 ${color}`} />
              <div>
                <p className="text-lg font-semibold">{data[key]}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

