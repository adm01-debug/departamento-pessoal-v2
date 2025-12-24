/**
 * @fileoverview Card de afastamento com informações do período
 * @module components/afastamentos/AfastamentoCard
 */
import { memo } from 'react';
import { Calendar, User, FileText, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type TipoAfastamento = 'atestado' | 'licenca_medica' | 'licenca_maternidade' | 'licenca_paternidade' | 'acidente_trabalho' | 'outros';
type StatusAfastamento = 'ativo' | 'encerrado' | 'pendente';

interface AfastamentoCardProps {
  id: string;
  colaboradorNome: string;
  tipo: TipoAfastamento;
  dataInicio: string;
  dataFim?: string;
  diasAfastado: number;
  motivo?: string;
  status: StatusAfastamento;
  cid?: string;
  onVerDetalhes?: (id: string) => void;
  onEditar?: (id: string) => void;
}

const tipoConfig: Record<TipoAfastamento, { label: string; color: string }> = {
  atestado: { label: 'Atestado Médico', color: 'bg-blue-500' },
  licenca_medica: { label: 'Licença Médica', color: 'bg-purple-500' },
  licenca_maternidade: { label: 'Licença Maternidade', color: 'bg-pink-500' },
  licenca_paternidade: { label: 'Licença Paternidade', color: 'bg-indigo-500' },
  acidente_trabalho: { label: 'Acidente de Trabalho', color: 'bg-red-500' },
  outros: { label: 'Outros', color: 'bg-gray-500' },
};

const statusConfig: Record<StatusAfastamento, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  ativo: { label: 'Em Andamento', variant: 'default' },
  encerrado: { label: 'Encerrado', variant: 'secondary' },
  pendente: { label: 'Pendente', variant: 'outline' },
};

/**
 * Card de afastamento com informações completas
 * @param props - Propriedades do afastamento
 * @returns Elemento React
 */
export const AfastamentoCard = memo(function AfastamentoCard({
  id,
  colaboradorNome,
  tipo,
  dataInicio,
  dataFim,
  diasAfastado,
  motivo,
  status,
  cid,
  onVerDetalhes,
  onEditar,
}: AfastamentoCardProps) {
  const tipoInfo = tipoConfig[tipo];
  const statusInfo = statusConfig[status];

  return (
    <Card className="hover:border-primary/30 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${tipoInfo.color}`} />
            <CardTitle className="text-base">{tipoInfo.label}</CardTitle>
          </div>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{colaboradorNome}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Início: {dataInicio}</span>
          </div>
          {dataFim && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Fim: {dataFim}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{diasAfastado} dia{diasAfastado !== 1 ? 's' : ''} de afastamento</span>
        </div>

        {cid && (
          <div className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>CID: {cid}</span>
          </div>
        )}

        {motivo && (
          <p className="text-sm text-muted-foreground line-clamp-2">{motivo}</p>
        )}

        <div className="flex gap-2 pt-2">
          {onVerDetalhes && (
            <Button variant="outline" size="sm" onClick={() => onVerDetalhes(id)}>
              Ver Detalhes
            </Button>
          )}
          {onEditar && status !== 'encerrado' && (
            <Button variant="ghost" size="sm" onClick={() => onEditar(id)}>
              Editar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
