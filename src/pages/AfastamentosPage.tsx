import { useState } from 'react';
import { useAfastamentos, useProrrogacoesAfastamento } from '@/hooks/useAfastamentos';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, Plus, Search, Filter, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AfastamentoStats } from '@/components/afastamentos/AfastamentoStats';
import { AfastamentoTable } from '@/components/afastamentos/AfastamentoTable';
import { AfastamentoForm } from '@/components/afastamentos/AfastamentoForm';
import { AfastamentoDocumentManager } from '@/components/afastamentos/AfastamentoDocumentManager';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { EmptyList } from '@/components/ui/empty-state';
import { format } from 'date-fns';

const tipoLabels: Record<string, string> = {
  doenca: 'Doença',
  acidente_trabalho: 'Acidente Trabalho',
  acidente_trajeto: 'Acidente Trajeto',
  licenca_maternidade: 'L. Maternidade',
  licenca_paternidade: 'L. Paternidade',
  licenca_casamento: 'L. Casamento',
  licenca_obito: 'L. Óbito',
  licenca_nao_remunerada: 'L. Não Remunerada',
  servico_militar: 'Serviço Militar',
  mandato_sindical: 'Mandato Sindical',
  suspensao_disciplinar: 'Suspensão Disc.',
  outros: 'Outros',
};

export default function AfastamentosPage() {
  const { afastamentos, isLoading } = useAfastamentos();
  const { prorrogacoes, isLoading: loadProrr } = useProrrogacoesAfastamento();
  
  const [activeTab, setActiveTab] = useState('afastamentos');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDocOpen, setIsDocOpen] = useState(false);
  const [selectedAfastamento, setSelectedAfastamento] = useState<any>(null);

  const stats = {
    total: afastamentos.length,
    ativos: afastamentos.filter((a: any) => a.status === 'ativo').length,
    pendentes: afastamentos.filter((a: any) => a.status === 'pendente').length,
    finalizados: afastamentos.filter((a: any) => a.status === 'finalizado' || a.status === 'concluido').length,
    diasTotais: afastamentos.reduce((sum: number, a: any) => sum + (a.dias_total || 0), 0),
  };

  const filteredAfastamentos = afastamentos.filter((a: any) => 
    a.colaborador?.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.cid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.tipo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (af: any) => {
    setSelectedAfastamento(af);
    setIsFormOpen(true);
  };

  const handleDocuments = (af: any) => {
    setSelectedAfastamento(af);
    setIsDocOpen(true);
  };

  const handleNew = () => {
    setSelectedAfastamento(null);
    setIsFormOpen(true);
  };

  return (
    <PageLayout
      title="Gestão de Afastamentos"
      description="Controle integral de licenças, atestados e encaminhamentos ao INSS"
      icon={<Heart className="h-5 w-5 text-white" />}
      gradient="from-red-500 to-orange-500"
      actions={
        <Button 
          onClick={handleNew}
          className="rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:opacity-90 shadow-md font-medium"
        >
          <Plus className="h-4 w-4 mr-2" /> Novo Afastamento
        </Button>
      }
    >
      <AfastamentoStats stats={stats} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="afastamentos" className="rounded-lg">Afastamentos</TabsTrigger>
            <TabsTrigger value="prorrogacoes" className="rounded-lg">Prorrogações</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por colaborador, CID..." 
                className="pl-9 bg-card shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="shadow-sm">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="shadow-sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="afastamentos" className="mt-0">
          {isLoading ? (
            <div className="flex justify-center p-12"><Spinner size="lg" /></div>
          ) : filteredAfastamentos.length === 0 ? (
            <EmptyList entityName="afastamento" />
          ) : (
            <AfastamentoTable 
              data={filteredAfastamentos} 
              onEdit={handleEdit}
              onDocuments={handleDocuments}
              onProrrogacao={(af) => {
                // To be implemented or handled in edit/specific tab
                setSelectedAfastamento(af);
                setIsFormOpen(true);
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="prorrogacoes" className="mt-0">
          <Card className="border border-border/50 shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle className="text-lg font-display">Histórico de Prorrogações</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loadProrr ? (
                <div className="p-12 flex justify-center"><Spinner /></div>
              ) : prorrogacoes.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">Nenhuma prorrogação registrada.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Colaborador</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Fim Anterior</TableHead>
                      <TableHead>Novo Fim</TableHead>
                      <TableHead className="text-center">Dias Extras</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prorrogacoes.map((p: any) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{(p as any).afastamento?.colaborador?.nome_completo || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-normal">
                            {tipoLabels[(p as any).afastamento?.tipo] || (p as any).afastamento?.tipo || '-'}
                          </Badge>
                        </TableCell>
                        <TableCell>{p.data_fim_anterior ? format(new Date(p.data_fim_anterior), 'dd/MM/yyyy') : '-'}</TableCell>
                        <TableCell className="font-semibold text-primary">{p.data_fim_nova ? format(new Date(p.data_fim_nova), 'dd/MM/yyyy') : '-'}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="text-orange-600 bg-orange-50 border-orange-200">
                            +{p.dias_adicionais}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {format(new Date(p.created_at), 'dd/MM/yyyy')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedAfastamento ? 'Editar Afastamento' : 'Novo Registro de Afastamento'}
            </DialogTitle>
          </DialogHeader>
          <AfastamentoForm 
            initialData={selectedAfastamento} 
            onSuccess={() => {
              setIsFormOpen(false);
              setSelectedAfastamento(null);
            }} 
          />
        </DialogContent>
      </Dialog>

      {/* Documents Dialog */}
      <Dialog open={isDocOpen} onOpenChange={setIsDocOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Documentos e Anexos</DialogTitle>
            <div className="text-sm text-muted-foreground">
              Afastamento de: {selectedAfastamento?.colaborador?.nome_completo}
            </div>
          </DialogHeader>
          {selectedAfastamento && (
            <AfastamentoDocumentManager afastamentoId={selectedAfastamento.id} />
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
