// V15-502
import { useColaboradores } from '@/queries/colaboradores';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { EmptyState } from '@/components/empty';
import { formatCurrency } from '@/formatters/currency';
import { Eye, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface ColaboradorListProps { filters?: any; }
export function ColaboradorList({ filters }: ColaboradorListProps) {
  const navigate = useNavigate();
  const { data: colaboradores, isLoading } = useColaboradores(filters);
  if (isLoading) return <Spinner size="lg" />;
  if (!colaboradores?.length) return <EmptyState title="Nenhum colaborador" description="Cadastre o primeiro colaborador" action={{ label: 'Cadastrar', onClick: () => navigate('/colaboradores/novo') }} />;
  return (
    <Table><TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead>Cargo</TableHead><TableHead>Departamento</TableHead><TableHead>Salário</TableHead><TableHead>Status</TableHead><TableHead className="w-[100px]">Ações</TableHead></TableRow></TableHeader>
      <TableBody>{colaboradores.map(c => (<TableRow key={c.id}><TableCell className="flex items-center gap-2"><Avatar className="h-8 w-8"><AvatarFallback>{c.nome.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}</AvatarFallback></Avatar>{c.nome}</TableCell><TableCell>{c.cargo || '-'}</TableCell><TableCell>{c.departamento || '-'}</TableCell><TableCell>{formatCurrency(c.salario)}</TableCell><TableCell><StatusBadge status={c.status} variant={c.status === 'ativo' ? 'success' : 'warning'} /></TableCell><TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => navigate(`/colaboradores/${c.id}`)}><Eye className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => navigate(`/colaboradores/${c.id}/editar`)}><Edit className="h-4 w-4" /></Button></div></TableCell></TableRow>))}</TableBody>
    </Table>
  );
}
