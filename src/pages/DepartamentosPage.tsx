// V15-319
import { useState } from 'react';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
const departamentos = [{ id: '1', nome: 'TI', sigla: 'TI', responsavel: 'João Silva', colaboradores: 15 }, { id: '2', nome: 'RH', sigla: 'RH', responsavel: 'Maria Santos', colaboradores: 8 }, { id: '3', nome: 'Financeiro', sigla: 'FIN', responsavel: 'Carlos Lima', colaboradores: 12 }];
export default function DepartamentosPage() {
  return (
    <PageLayout title="Departamentos" actions={<Button><Plus className="h-4 w-4 mr-2" />Novo</Button>}>
      <Table>
        <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Sigla</TableHead><TableHead>Responsável</TableHead><TableHead>Colaboradores</TableHead><TableHead className="w-[100px]">Ações</TableHead></TableRow></TableHeader>
        <TableBody>{departamentos.map(d => (<TableRow key={d.id}><TableCell className="font-medium">{d.nome}</TableCell><TableCell>{d.sigla}</TableCell><TableCell>{d.responsavel}</TableCell><TableCell><div className="flex items-center gap-1"><Users className="h-4 w-4" />{d.colaboradores}</div></TableCell><TableCell><div className="flex gap-1"><Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button></div></TableCell></TableRow>))}</TableBody>
      </Table>
    </PageLayout>
  );
}
