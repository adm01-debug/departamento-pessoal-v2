import { PageTitle } from '@/components/PageTitle';
import { useState } from 'react';
import { PageLayout } from '@/components/layout';
import { useLocaisTrabalho } from '@/hooks/useLocaisTrabalho';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, MapPin } from 'lucide-react';

export default function LocaisTrabalhoPage() {
  const { locais, isLoading, criar, excluir } = useLocaisTrabalho();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nome: '', endereco: '', cidade: '', uf: '', cep: '', telefone: '' });

  const handleSubmit = async () => {
    if (!form.nome) return;
    await criar(form);
    setForm({ nome: '', endereco: '', cidade: '', uf: '', cep: '', telefone: '' });
    setShowForm(false);
  };

  return (
    <>
    <PageTitle title="Locais de Trabalho" description="Gestão de locais e endereços" />
    <PageLayout title="Locais de Trabalho">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" />Locais de Trabalho</CardTitle>
          <Button onClick={() => setShowForm(!showForm)}><Plus className="mr-2 h-4 w-4" />Novo Local</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {showForm && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 border rounded-lg bg-muted/30">
              <div><Label>Nome *</Label><Input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} /></div>
              <div><Label>Endereço</Label><Input value={form.endereco} onChange={e => setForm(f => ({ ...f, endereco: e.target.value }))} /></div>
              <div><Label>Cidade</Label><Input value={form.cidade} onChange={e => setForm(f => ({ ...f, cidade: e.target.value }))} /></div>
              <div><Label>UF</Label><Input maxLength={2} value={form.uf} onChange={e => setForm(f => ({ ...f, uf: e.target.value.toUpperCase() }))} /></div>
              <div><Label>CEP</Label><Input value={form.cep} onChange={e => setForm(f => ({ ...f, cep: e.target.value }))} /></div>
              <div><Label>Telefone</Label><Input value={form.telefone} onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))} /></div>
              <div className="flex items-end"><Button onClick={handleSubmit}>Salvar</Button></div>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Cidade/UF</TableHead>
                <TableHead>CEP</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={6} className="text-center">Carregando...</TableCell></TableRow>}
              {!isLoading && locais.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">Nenhum local cadastrado</TableCell></TableRow>}
              {locais.map((l: any) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium">{l.nome}</TableCell>
                  <TableCell>{l.endereco || '—'}</TableCell>
                  <TableCell>{[l.cidade, l.uf].filter(Boolean).join('/') || '—'}</TableCell>
                  <TableCell>{l.cep || '—'}</TableCell>
                  <TableCell><Badge variant={l.ativo ? 'default' : 'secondary'}>{l.ativo ? 'Ativo' : 'Inativo'}</Badge></TableCell>
                  <TableCell><Button variant="ghost" size="icon" onClick={() => excluir(l.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageLayout>
    </>
  );
}
