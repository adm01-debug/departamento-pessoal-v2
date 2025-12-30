import { SEOHead } from '@/components/SEOHead';
import { useState, memo, useEffect, useCallback } from 'react';
import { Plus, FileText, Clock, List, Calendar, LayoutGrid, Loader2, Pencil, AlertTriangle, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { AdmissaoChecklistModal } from '@/components/admissao/AdmissaoChecklistModal';
import { NovaAdmissaoModal, NovaAdmissaoData } from '@/components/admissao/NovaAdmissaoModal';
import { EditarAdmissaoModal } from '@/components/admissao/EditarAdmissaoModal';
import { ContratacaoDigitalModal } from '@/components/admissao/ContratacaoDigitalModal';
import { CalendarioAdmissoes } from '@/components/admissao/CalendarioAdmissoes';
import { useAdmissoes, Admissao as AdmissaoType, EtapaAdmissao } from '@/hooks/useAdmissoes';
import { toast } from 'sonner';

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

const AdmissaoPage = memo(function AdmissaoPage() {
  useEffect(() => {
    document.title = 'Admissões | DP System';
  }, []);

  const { 
    admissoes, 
    loading, 
    createAdmissao, 
    updateAdmissao,
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
  const [editarOpen, setEditarOpen] = useState(false);
  const [contratacaoDigitalOpen, setContratacaoDigitalOpen] = useState(false);

  // Verificar se dados pessoais estão incompletos
  const isDadosIncompletos = (adm: AdmissaoType) => {
    return !adm.cpf || !adm.data_nascimento || !adm.sexo || !adm.nome_mae;
  };

  // Obter lista de campos faltantes
  const getCamposFaltantes = (adm: AdmissaoType): string[] => {
    const campos: string[] = [];
    if (!adm.cpf) campos.push('CPF');
    if (!adm.data_nascimento) campos.push('Data de Nascimento');
    if (!adm.sexo) campos.push('Sexo');
    if (!adm.nome_mae) campos.push('Nome da Mãe');
    return campos;
  };

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
      salario_proposto: data.salarioProposto ?? 0,
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

  const handleEditAdmissao = (admissao: AdmissaoType, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedAdmissao(admissao);
    setEditarOpen(true);
  };

  const handleSaveAdmissao = async (id: string, data: Partial<AdmissaoType>) => {
    await updateAdmissao(id, data);
    toast.success('Admissão atualizada com sucesso!');
    // Update local selected admissao if open
    if (selectedAdmissao?.id === id) {
      setSelectedAdmissao({ ...selectedAdmissao, ...data } as AdmissaoType);
    }
  };

  if (loading) {
    return (
      <>
        <SEOHead title="Admissões | DP System" description="Gestão de admissões de colaboradores" />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Admissões | DP System" description="Gestão de admissões de colaboradores" />
      <div id="main-content" className="p-6 space-y-6 animate-fade-in">
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
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'kanban' | 'lista')}>
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
                    const dadosIncompletos = isDadosIncompletos(adm);
                    return (
                      <div 
                        key={adm.id}
                        onClick={() => handleOpenChecklist(adm)}
                        className={cn(
                          "p-4 rounded-lg bg-card border shadow-sm hover-lift cursor-pointer group",
                          dadosIncompletos ? "border-warning/50" : "border-border"
                        )}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary">
                              {adm.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => handleEditAdmissao(adm, e)}
                            >
                              <Pencil className="w-3 h-3" />
                            </Button>
                            <Badge variant="outline" className="text-xs">
                              {progress}%
                            </Badge>
                          </div>
                        </div>
                        
                        <h4 className="font-medium text-sm text-foreground mb-1">{adm.nome}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{adm.cargo}</p>
                        <p className="text-xs text-muted-foreground">{adm.departamento}</p>
                        
                        {/* Indicador de dados incompletos */}
                        {dadosIncompletos && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1.5 mt-2 text-warning cursor-help">
                                  <AlertTriangle className="w-3 h-3" />
                                  <span className="text-xs">Dados pessoais incompletos</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="font-medium mb-1">Campos faltantes:</p>
                                <ul className="text-xs list-disc pl-4">
                                  {getCamposFaltantes(adm).map(campo => (
                                    <li key={campo}>{campo}</li>
                                  ))}
                                </ul>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        
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
                  const dadosIncompletos = isDadosIncompletos(adm);
                  return (
                    <tr key={adm.id} className="border-t hover:bg-muted/30">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary">
                              {adm.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{adm.nome}</span>
                            {dadosIncompletos && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="flex items-center gap-1 text-warning text-xs cursor-help">
                                      <AlertTriangle className="w-3 h-3" />
                                      Dados incompletos
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="font-medium mb-1">Campos faltantes:</p>
                                    <ul className="text-xs list-disc pl-4">
                                      {getCamposFaltantes(adm).map(campo => (
                                        <li key={campo}>{campo}</li>
                                      ))}
                                    </ul>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
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
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" onClick={() => handleEditAdmissao(adm)}>
                            <Pencil className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleOpenChecklist(adm)}>
                            Checklist
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="calendario" className="mt-4">
          <CalendarioAdmissoes 
            admissoes={admissoes.map(a => ({
              id: a.id,
              nome: a.nome,
              cargo: a.cargo,
              departamento: a.departamento,
              data_prevista: a.data_prevista,
              etapa: a.etapa
            }))}
            etapaLabels={etapaLabels}
            onSelectAdmissao={(adm) => {
              const fullAdm = admissoes.find(a => a.id === adm.id);
              if (fullAdm) handleOpenChecklist(fullAdm);
            }}
          />
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
          cpf: selectedAdmissao.cpf,
          data_nascimento: selectedAdmissao.data_nascimento,
          sexo: selectedAdmissao.sexo,
          nome_mae: selectedAdmissao.nome_mae,
        } : null}
        onAdvanceStage={handleAdvanceStage}
        onConvertToColaborador={handleConvertToColaborador}
        onEdit={() => {
          setChecklistOpen(false);
          setEditarOpen(true);
        }}
        onOpenContratacaoDigital={() => {
          setChecklistOpen(false);
          setContratacaoDigitalOpen(true);
        }}
      />

      <NovaAdmissaoModal
        open={novaAdmissaoOpen}
        onOpenChange={setNovaAdmissaoOpen}
        onSubmit={handleNovaAdmissao}
      />

      <EditarAdmissaoModal
        open={editarOpen}
        onOpenChange={setEditarOpen}
        admissao={selectedAdmissao}
        onSave={handleSaveAdmissao}
      />

      <ContratacaoDigitalModal
        open={contratacaoDigitalOpen}
        onOpenChange={setContratacaoDigitalOpen}
        admissao={selectedAdmissao}
      />
    </div>
    </>
  );
}
