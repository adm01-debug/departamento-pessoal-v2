import { PageTitle } from '@/components/PageTitle';
import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout';
import { useLocaisTrabalho } from '@/hooks/useLocaisTrabalho';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, MapPin, Search, FilterX } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { motion, AnimatePresence } from 'framer-motion';

export default function LocaisTrabalhoPage() {
  const { 
    locais, 
    total,
    isLoading, 
    isFetching,
    page,
    setPage,
    pageSize,
    search,
    setSearch,
    criar, 
    excluir 
  } = useLocaisTrabalho();
  
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nome: '', endereco: '', cidade: '', uf: '', cep: '', telefone: '' });

  useEffect(() => {
    setPage(1);
  }, [search, setPage]);

  const handleSubmit = async () => {
    if (!form.nome) return;
    await criar(form);
    setForm({ nome: '', endereco: '', cidade: '', uf: '', cep: '', telefone: '' });
    setShowForm(false);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      <PageTitle title="Locais de Trabalho" description="Gestão de locais e endereços" />
      <PageLayout 
        title="Locais de Trabalho"
        description="Gestão de unidades físicas e pontos de presença"
        icon={<MapPin className="h-5 w-5 text-primary-foreground" />}
        gradient="from-primary to-primary-glow"
        actions={
          <Button onClick={() => setShowForm(!showForm)} className="rounded-xl shadow-glow">
            <Plus className="mr-2 h-4 w-4" />{showForm ? 'Cancelar' : 'Novo Local'}
          </Button>
        }
      >
        <div className="space-y-6">
          <AnimatePresence>
            {showForm && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Card className="border-primary/20 bg-primary/5 rounded-2xl mb-6 shadow-sm">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Nome *</Label>
                        <Input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Ex: Matriz" />
                      </div>
                      <div className="space-y-2">
                        <Label>Endereço</Label>
                        <Input value={form.endereco} onChange={e => setForm(f => ({ ...f, endereco: e.target.value }))} placeholder="Rua..." />
                      </div>
                      <div className="space-y-2">
                        <Label>Cidade</Label>
                        <Input value={form.cidade} onChange={e => setForm(f => ({ ...f, cidade: e.target.value }))} placeholder="São Paulo" />
                      </div>
                      <div className="space-y-2">
                        <Label>UF</Label>
                        <Input maxLength={2} value={form.uf} onChange={e => setForm(f => ({ ...f, uf: e.target.value.toUpperCase() }))} placeholder="SP" />
                      </div>
                      <div className="space-y-2">
                        <Label>CEP</Label>
                        <Input value={form.cep} onChange={e => setForm(f => ({ ...f, cep: e.target.value }))} placeholder="00000-000" />
                      </div>
                      <div className="space-y-2">
                        <Label>Telefone</Label>
                        <Input value={form.telefone} onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))} placeholder="(00) 0000-0000" />
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button onClick={handleSubmit} className="rounded-xl px-8 shadow-glow">Salvar Local</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <Card className="border-border/30 rounded-2xl shadow-sm bg-card overflow-hidden">
            <CardHeader className="border-b border-border/10 pb-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2 text-lg font-display">
                  <MapPin className="h-5 w-5 text-primary" />
                  Locais Registrados
                </CardTitle>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Filtrar por nome..." 
                    className="pl-9 h-10 rounded-xl"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative">
                {isFetching && !isLoading && (
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                    <Spinner size="md" />
                  </div>
                )}
                
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="font-display font-semibold py-4 pl-6">Nome</TableHead>
                      <TableHead className="font-display font-semibold">Endereço</TableHead>
                      <TableHead className="font-display font-semibold">Cidade/UF</TableHead>
                      <TableHead className="font-display font-semibold">CEP</TableHead>
                      <TableHead className="font-display font-semibold">Status</TableHead>
                      <TableHead className="w-[80px] text-right pr-6">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow><TableCell colSpan={6} className="py-20 text-center"><Spinner size="lg" className="mx-auto" /></TableCell></TableRow>
                    ) : total === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="py-20 text-center">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            {search ? <FilterX className="h-10 w-10 opacity-20 mb-2" /> : <MapPin className="h-10 w-10 opacity-20 mb-2" />}
                            <p className="font-display font-bold">{search ? 'Nenhum local encontrado' : 'Nenhum local cadastrado'}</p>
                            {search && <Button variant="link" onClick={() => setSearch('')}>Limpar busca</Button>}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      locais.map((l: any) => (
                        <TableRow key={l.id} className="hover:bg-accent/10 transition-colors group">
                          <TableCell className="font-medium pl-6">{l.nome}</TableCell>
                          <TableCell className="text-sm">{l.endereco || '—'}</TableCell>
                          <TableCell className="text-sm font-body">{[l.cidade, l.uf].filter(Boolean).join('/') || '—'}</TableCell>
                          <TableCell className="text-sm font-mono">{l.cep || '—'}</TableCell>
                          <TableCell>
                            <Badge className={l.ativo !== false ? 'bg-success/10 text-success border-0 text-[10px]' : 'bg-muted text-muted-foreground border-0 text-[10px]'}>
                              {l.ativo !== false ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => excluir(l.id)}
                              className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="p-4 border-t border-border/10">
                <DataTablePagination 
                  currentPage={page}
                  totalPages={totalPages}
                  totalItems={total}
                  pageSize={pageSize}
                  onPageChange={setPage}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    </>
  );
}
