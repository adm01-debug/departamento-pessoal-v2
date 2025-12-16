import { useState } from 'react';
import { Plus, FileText, Clock, List, Calendar, LayoutGrid, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { AdmissaoChecklistModal } from '@/components/admissao/AdmissaoChecklistModal';
import { NovaAdmissaoModal, NovaAdmissaoData } from '@/components/admissao/NovaAdmissaoModal';
import { useAdmissoes, Admissao as AdmissaoType, EtapaAdmissao } from '@/hooks/useAdmissoes';

const etapaColors: Record<string, string> = {
  'Solicitação Recebida': 'bg-info/20 border-info',
  'Coleta de Documentos': 'bg-warning/20 border-warning',
  'Validação': 'bg-primary/20 border-primary',
  'Pendente': 'bg-muted/20 border-muted-foreground',
  'Exame Admissional': 'bg-success/20 border-success',
  'Contrato': 'bg-loggi/20 border-loggi',
  'Assinatura': 'bg-info/20 border-info',
  'eSocial': 'bg-primary/20 border-primary',
};

export default function AdmissaoPage() {
  const { 
    admissoes, 
    loading, 
    createAdmissao, 
    advanceStage, 
    getProgress,
    converterParaColaborador,
    etapaLabels,
    etapaOrder
  } = useAdmissoes();
  
  const [viewMode, setViewMode] = useState<'kanban' | 'lista' | 'calendario'>('kanban');
  const [selectedAdmissao, setSelectedAdmissao] = useState<AdmissaoType | null>(null);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [novaAdmissaoOpen, setNovaAdmissaoOpen] = useState(false);

  // Agrupar por etapa
  const admissoesPorEtapa = etapaOrder.map(etapa => ({
    etapa,
    label: etapaLabels[etapa],
    admissoes: admissoes.filter(a => a.etapa === etapa)
  }));

  const handleOpenChecklist = (admissao: AdmissaoType) => {
    setSelectedAdmissao(admissao);
    setChecklistOpen(true);
  };

  const handleNovaAdmissao = async (data: NovaAdmissaoData) => {
    await createAdmissao({
      nome: data.candidatoNome,
      cargo: data.cargo,
      departamento: data.departamento,
      salario_proposto: data.salarioProposto || 0,
      data_prevista: data.dataPrevisao.toISOString().split('T')[0],
      observacoes: data.observacoes,
      cpf: data.cpf,
      data_nascimento: data.dataNascimento?.toISOString().split('T')[0],
      sexo: data.sexo,
      email: data.email,
      telefone: data.telefone,
      estado_civil: data.estadoCivil,
      nome_mae: data.nomeMae,
    });
  };

  const handleAdvanceStage = async () => {
    if (!selectedAdmissao) return;
    await advanceStage(selectedAdmissao);
    // Refresh selected admissao
    const currentIndex = etapaOrder.indexOf(selectedAdmissao.etapa);
    if (currentIndex < etapaOrder.length - 1) {
      setSelectedAdmissao({
        ...selectedAdmissao,
        etapa: etapaOrder[currentIndex + 1]
      });
    }
  };

  const handleConvertToColaborador = async () => {
    if (!selectedAdmissao) return;
    await converterParaColaborador(selectedAdmissao);
    setChecklistOpen(false);
    setSelectedAdmissao(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Admissão</h1>
          <p className="text-muted-foreground text-sm">Processos admissionais em andamento</p>
        </div>
        <Button className="gap-2" onClick={() => setNovaAdmissaoOpen(true)}>
          <Plus className="w-4 h-4" />
          Nova Admissão
        </Button>
      </div>

      {/* View Toggle */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
        <TabsList>
          <TabsTrigger value="kanban" className="gap-2">
            <LayoutGrid className="w-4 h-4" />
            Kanban
          </TabsTrigger>
          <TabsTrigger value="lista" className="gap-2">
            <List className="w-4 h-4" />
            Lista
          </TabsTrigger>
          <TabsTrigger value="calendario" className="gap-2">
            <Calendar className="w-4 h-4" />
            Calendário
          </TabsTrigger>
        </TabsList>

        {/* Kanban View */}
        <TabsContent value="kanban" className="mt-4">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
            {admissoesPorEtapa.map(({ etapa, label, admissoes }) => (
              <div key={etapa} className="flex-shrink-0 w-72">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{label}</h3>
                    <Badge variant="secondary" className="text-xs">{admissoes.length}</Badge>
                  </div>
                </div>

                {/* Column Content */}
                <div className={cn(
                  "min-h-[400px] p-2 rounded-xl border-2 border-dashed space-y-3",
                  etapaColors[label] || 'bg-muted/20 border-border'
                )}>
                  {admissoes.map((adm) => {
                    const progress = getProgress(adm);
                    return (
                      <div 
                        key={adm.id}
                        onClick={() => handleOpenChecklist(adm)}
                        className="p-4 rounded-lg bg-card border border-border shadow-sm hover-lift cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary">
                              {adm.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {progress}%
                          </Badge>
                        </div>
                        
                        <h4 className="font-medium text-sm text-foreground mb-1">{adm.nome}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{adm.cargo}</p>
                        <p className="text-xs text-muted-foreground">{adm.departamento}</p>
                        
                        {/* Progress bar */}
                        <div className="mt-3">
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>Prev: {new Date(adm.data_prevista).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    );
                  })}

                  {admissoes.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                      <FileText className="w-8 h-8 mb-2 opacity-50" />
                      <p className="text-xs">Nenhuma admissão</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Lista View */}
        <TabsContent value="lista" className="mt-4">
          <div className="rounded-lg border">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 text-sm font-medium">Candidato</th>
                  <th className="text-left p-3 text-sm font-medium">Cargo</th>
                  <th className="text-left p-3 text-sm font-medium">Departamento</th>
                  <th className="text-left p-3 text-sm font-medium">Etapa</th>
                  <th className="text-left p-3 text-sm font-medium">Progresso</th>
                  <th className="text-left p-3 text-sm font-medium">Previsão</th>
                  <th className="text-left p-3 text-sm font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {admissoes.map((adm) => {
                  const progress = getProgress(adm);
                  return (
                    <tr key={adm.id} className="border-t hover:bg-muted/30">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary">
                              {adm.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                            </span>
                          </div>
                          <span className="font-medium text-sm">{adm.nome}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm">{adm.cargo}</td>
                      <td className="p-3 text-sm">{adm.departamento}</td>
                      <td className="p-3">
                        <Badge variant="secondary" className="text-xs">{etapaLabels[adm.etapa]}</Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs">{progress}%</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm">
                        {new Date(adm.data_prevista).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-3">
                        <Button size="sm" variant="ghost" onClick={() => handleOpenChecklist(adm)}>
                          Checklist
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Calendário View */}
        <TabsContent value="calendario" className="mt-4">
          <div className="p-8 rounded-lg border bg-muted/20 text-center">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Visualização em Calendário</h3>
            <p className="text-muted-foreground text-sm">
              Em breve: visualize as admissões por data prevista no calendário
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AdmissaoChecklistModal
        open={checklistOpen}
        onOpenChange={setChecklistOpen}
        admissao={selectedAdmissao ? {
          id: selectedAdmissao.id,
          candidatoNome: selectedAdmissao.nome,
          cargo: selectedAdmissao.cargo,
          departamento: selectedAdmissao.departamento,
          etapa: etapaLabels[selectedAdmissao.etapa],
          progresso: getProgress(selectedAdmissao),
          dataPrevisao: selectedAdmissao.data_prevista,
        } : null}
        onAdvanceStage={handleAdvanceStage}
        onConvertToColaborador={handleConvertToColaborador}
      />

      <NovaAdmissaoModal
        open={novaAdmissaoOpen}
        onOpenChange={setNovaAdmissaoOpen}
        onSubmit={handleNovaAdmissao}
      />
    </div>
  );
}
