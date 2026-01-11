// V15-326
import { PageLayout } from '@/components/layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Key } from 'lucide-react';
const usuarios = [{ id: '1', nome: 'Admin', email: 'admin@empresa.com', role: 'admin', status: 'ativo' }, { id: '2', nome: 'RH', email: 'rh@empresa.com', role: 'rh', status: 'ativo' }, { id: '3', nome: 'Gestor', email: 'gestor@empresa.com', role: 'gestor', status: 'inativo' }];
export default function UsuariosPage() {
  return (
    <PageLayout title="Usuários" actions={<Button><Plus className="h-4 w-4 mr-2" />Novo</Button>}>
      <Table><TableHeader><TableRow><TableHead>Usuário</TableHead><TableHead>Email</TableHead><TableHead>Perfil</TableHead><TableHead>Status</TableHead><TableHead className="w-[100px]">Ações</TableHead></TableRow></TableHeader>
        <TableBody>{usuarios.map(u => (<TableRow key={u.id}><TableCell className="flex items-center gap-2"><Avatar className="h-8 w-8"><AvatarFallback>{u.nome[0]}</AvatarFallback></Avatar>{u.nome}</TableCell><TableCell>{u.email}</TableCell><TableCell><Badge variant="outline">{u.role}</Badge></TableCell><TableCell><Badge variant={u.status === 'ativo' ? 'default' : 'secondary'}>{u.status}</Badge></TableCell><TableCell><div className="flex gap-1"><Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon"><Key className="h-4 w-4" /></Button></div></TableCell></TableRow>))}</TableBody>
      </Table>
    </PageLayout>
  );
}
