import { useState, memo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  User, 
  FileText, 
  Calendar, 
  Clock, 
  DollarSign, 
  Download, 
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Building2,
  Briefcase
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { gerarHoleritePDF } from '@/lib/documentosPDF';

export default memo(function PortalColaborador() {
  useEffect(() => { document.title = 'Portal do Colaborador | DP System'; }, []);

  const { user, profile, updateProfile } = useAuth();
  const queryClient = useQueryClient();
  const [editingDados, setEditingDados] = useState(false);
  const [dadosPessoais, setDadosPessoais] = useState({
    telefone: profile?.telefone ?? '',
  });

  // Buscar colaborador vinculado ao usuário (por email)
  const { data: colaborador, isLoading: loadingColaborador } = useQuery({
    queryKey: ['portal-colaborador', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const { data, error } = await supabase
        .from('colaboradores')
        .select('*')
        .eq('email', user.email)
        .eq('status', 'ativo')
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.email
  });

  // Buscar holerites do colaborador
  const { data: holerites = [], isLoading: loadingHolerites } = useQuery({
    queryKey: ['portal-holerites', colaborador?.id],
    queryFn: async () => {
      if (!colaborador?.id) return [];
      const { data, error } = await supabase
        .from('holerites')
        .select('*, folhas_pagamento(competencia, status)')
        .eq('colaborador_id', colaborador.id)
        .order('created_at', { ascending: false })
        .limit(12);
      if (error) throw error;
      return data;
    },
    enabled: !!colaborador?.id
  });

  // Buscar férias do colaborador
  const { data: ferias = [], isLoading: loadingFerias } = useQuery({
    queryKey: ['portal-ferias', colaborador?.id],
    queryFn: async () => {
      if (!colaborador?.id) return [];
      const { data, error } = await supabase
        .from('ferias')
        .select('*')
        .eq('colaborador_id', colaborador.id)
        .order('data_inicio', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!colaborador?.id
  });

  // Buscar registros de ponto recentes
  const { data: pontos = [], isLoading: loadingPontos } = useQuery({
    queryKey: ['portal-pontos', colaborador?.id],
    queryFn: async () => {
      if (!colaborador?.id) return [];
      const { data, error } = await supabase
        .from('registros_ponto')
        .select('*')
        .eq('colaborador_id', colaborador.id)
        .order('data', { ascending: false })
        .limit(30);
      if (error) throw error;
      return data;
    },
    enabled: !!colaborador?.id
  });

  // Buscar documentos para assinar
  const { data: documentosPendentes = [] } = useQuery({
    queryKey: ['portal-documentos-pendentes', colaborador?.id],
    queryFn: async () => {
      if (!colaborador?.id) return [];
      const { data, error } = await supabase
        .from('documentos_assinatura')
        .select('*')
        .eq('colaborador_id', colaborador.id)
        .eq('status', 'pendente')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!colaborador?.id
  });

  // Mutation para solicitar férias
  const solicitarFeriasMutation = useMutation({
    mutationFn: async (dados: { data_inicio: string; dias_gozo: number }) => {
      if (!colaborador) throw new Error('Colaborador não encontrado');
      
      const dataFim = new Date(dados.data_inicio);
      dataFim.setDate(dataFim.getDate() + dados.dias_gozo - 1);
      
      const { error } = await supabase.from('ferias').insert({
        colaborador_id: colaborador.id,
        data_inicio: dados.data_inicio,
        data_fim: dataFim.toISOString().split('T')[0],
        dias_gozo: dados.dias_gozo,
        salario_base: colaborador.salario_base,
        valor_ferias: (colaborador.salario_base / 30) * dados.dias_gozo,
        valor_terco: ((colaborador.salario_base / 30) * dados.dias_gozo) / 3,
        valor_total: ((colaborador.salario_base / 30) * dados.dias_gozo) * 1.333,
        valor_liquido: ((colaborador.salario_base / 30) * dados.dias_gozo) * 1.333,
        status: 'programada'
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Solicitação de férias enviada!');
      queryClient.invalidateQueries({ queryKey: ['portal-ferias'] });
    },
    onError: () => toast.error('Erro ao solicitar férias')
  });

  const handleSalvarDados = async () => {
    const { error } = await updateProfile({ telefone: dadosPessoais.telefone });
    if (error) {
      toast.error('Erro ao atualizar dados');
    } else {
      toast.success('Dados atualizados com sucesso!');
      setEditingDados(false);
    }
  };

  const statusFeriasColors: Record<string, string> = {
    programada: 'bg-info/20 text-info border-info/30',
    aprovada: 'bg-success/20 text-success border-success/30',
    em_gozo: 'bg-warning/20 text-warning border-warning/30',
    concluida: 'bg-muted text-muted-foreground',
    cancelada: 'bg-destructive/20 text-destructive border-destructive/30'
  };

  if (loadingColaborador) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!colaborador) {
    return (
      <div className="p-6">
        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <AlertCircle className="h-12 w-12 text-warning" />
              <div>
                <h3 className="text-lg font-semibold">Acesso Restrito</h3>
                <p className="text-muted-foreground">
                  Seu email ({user?.email}) não está vinculado a nenhum colaborador ativo. 
                  Entre em contato com o RH para regularizar seu cadastro.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header com informações do colaborador */}
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{colaborador.nome_completo}</h2>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge variant="outline" className="gap-1">
                    <Briefcase className="h-3 w-3" />
                    {colaborador.cargo}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Building2 className="h-3 w-3" />
                    {colaborador.departamento}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {colaborador.email || 'Não informado'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {colaborador.celular || colaborador.telefone || 'Não informado'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Admissão: {format(new Date(colaborador.data_admissao), 'dd/MM/yyyy')}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards de resumo */}
        <div className="grid grid-cols-2 gap-4 md:w-80">
          <Card>
            <CardContent className="pt-4 text-center">
              <DollarSign className="h-6 w-6 mx-auto text-success mb-2" />
              <p className="text-xs text-muted-foreground">Salário Base</p>
              <p className="font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(colaborador.salario_base)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <FileText className="h-6 w-6 mx-auto text-warning mb-2" />
              <p className="text-xs text-muted-foreground">Docs Pendentes</p>
              <p className="font-bold">{documentosPendentes.length}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs principais */}
      <Tabs defaultValue="holerites" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="holerites" className="gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Holerites</span>
          </TabsTrigger>
          <TabsTrigger value="ferias" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Férias</span>
          </TabsTrigger>
          <TabsTrigger value="ponto" className="gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Ponto</span>
          </TabsTrigger>
          <TabsTrigger value="dados" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Meus Dados</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Holerites */}
        <TabsContent value="holerites">
          <Card>
            <CardHeader>
              <CardTitle>Meus Holerites</CardTitle>
              <CardDescription>Consulte seus demonstrativos de pagamento</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingHolerites ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : holerites.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum holerite disponível
                </p>
              ) : (
                <div className="space-y-3">
                  {holerites.map((holerite: unknown) => (
                    <div 
                      key={holerite.id} 
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-medium">
                            Competência: {holerite.folhas_pagamento?.competencia || 'N/A'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Líquido: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(holerite.liquido)}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          gerarHoleritePDF({
                            competencia: holerite.folhas_pagamento?.competencia || 'N/A',
                            colaborador_nome: holerite.colaborador_nome,
                            colaborador_cpf: holerite.colaborador_cpf,
                            colaborador_matricula: holerite.colaborador_matricula,
                            colaborador_cargo: holerite.colaborador_cargo,
                            colaborador_departamento: holerite.colaborador_departamento,
                            salario_base: holerite.salario_base,
                            total_proventos: holerite.total_proventos,
                            total_descontos: holerite.total_descontos,
                            liquido: holerite.liquido,
                            valor_inss: holerite.valor_inss,
                            valor_irrf: holerite.valor_irrf,
                            valor_fgts: holerite.valor_fgts,
                            horas_extras_50: holerite.horas_extras_50,
                            horas_extras_100: holerite.horas_extras_100,
                            faltas_dias: holerite.faltas_dias,
                          });
                          toast.success('PDF gerado com sucesso!');
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Férias */}
        <TabsContent value="ferias">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Minhas Férias</CardTitle>
                <CardDescription>Histórico e solicitações</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingFerias ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : ferias.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhum registro de férias
                  </p>
                ) : (
                  <div className="space-y-3">
                    {ferias.map((f: unknown) => (
                      <div key={f.id} className="p-4 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={statusFeriasColors[f.status] ?? ''}>
                            {f.status?.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {f.dias_gozo} dias
                          </span>
                        </div>
                        <p className="text-sm">
                          {format(new Date(f.data_inicio), "dd 'de' MMM", { locale: ptBR })} 
                          {' - '}
                          {format(new Date(f.data_fim), "dd 'de' MMM 'de' yyyy", { locale: ptBR })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Solicitar Férias</CardTitle>
                <CardDescription>Envie uma nova solicitação</CardDescription>
              </CardHeader>
              <CardContent>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const formData = new FormData(form);
                    solicitarFeriasMutation.mutate({
                      data_inicio: formData.get('data_inicio') as string,
                      dias_gozo: parseInt(formData.get('dias_gozo') as string)
                    });
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="data_inicio">Data de Início</Label>
                    <Input 
                      id="data_inicio" 
                      name="data_inicio" 
                      type="date" 
                      required 
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dias_gozo">Dias de Gozo</Label>
                    <Input 
                      id="dias_gozo" 
                      name="dias_gozo" 
                      type="number" 
                      min="5" 
                      max="30" 
                      defaultValue="30"
                      required 
                    />
                    <p className="text-xs text-muted-foreground">Mínimo 5 dias, máximo 30 dias</p>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={solicitarFeriasMutation.isPending}
                  >
                    {solicitarFeriasMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Enviar Solicitação
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Ponto */}
        <TabsContent value="ponto">
          <Card>
            <CardHeader>
              <CardTitle>Meu Espelho de Ponto</CardTitle>
              <CardDescription>Últimos 30 registros</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingPontos ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : pontos.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum registro de ponto
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3">Data</th>
                        <th className="text-center py-2 px-3">Entrada 1</th>
                        <th className="text-center py-2 px-3">Saída 1</th>
                        <th className="text-center py-2 px-3">Entrada 2</th>
                        <th className="text-center py-2 px-3">Saída 2</th>
                        <th className="text-center py-2 px-3">Total</th>
                        <th className="text-center py-2 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pontos.map((p: unknown) => (
                        <tr key={p.id} className="border-b hover:bg-muted/50">
                          <td className="py-2 px-3">
                            {format(new Date(p.data), 'dd/MM/yyyy')}
                          </td>
                          <td className="text-center py-2 px-3">{p.entrada_1 || '-'}</td>
                          <td className="text-center py-2 px-3">{p.saida_1 || '-'}</td>
                          <td className="text-center py-2 px-3">{p.entrada_2 || '-'}</td>
                          <td className="text-center py-2 px-3">{p.saida_2 || '-'}</td>
                          <td className="text-center py-2 px-3 font-medium">
                            {p.horas_trabalhadas || '-'}
                          </td>
                          <td className="text-center py-2 px-3">
                            {p.aprovado ? (
                              <CheckCircle className="h-4 w-4 text-success mx-auto" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-warning mx-auto" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Meus Dados */}
        <TabsContent value="dados">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
                <CardDescription>Informações do seu cadastro</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">CPF</Label>
                    <p className="font-medium">{colaborador.cpf}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">RG</Label>
                    <p className="font-medium">{colaborador.rg || 'Não informado'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Data de Nascimento</Label>
                    <p className="font-medium">
                      {format(new Date(colaborador.data_nascimento), 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Estado Civil</Label>
                    <p className="font-medium capitalize">{colaborador.estado_civil}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <Label className="text-muted-foreground">Endereço</Label>
                  <p className="font-medium">
                    {colaborador.logradouro ? (
                      `${colaborador.logradouro}, ${colaborador.numero || 's/n'}${colaborador.complemento ? ` - ${colaborador.complemento}` : ''}`
                    ) : (
                      'Não informado'
                    )}
                  </p>
                  {colaborador.bairro && (
                    <p className="text-sm text-muted-foreground">
                      {colaborador.bairro} - {colaborador.cidade}/{colaborador.uf}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dados Bancários</CardTitle>
                <CardDescription>Informações para pagamento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Banco</Label>
                    <p className="font-medium">{colaborador.banco_nome || 'Não informado'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Agência</Label>
                    <p className="font-medium">{colaborador.agencia || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Conta</Label>
                    <p className="font-medium">{colaborador.conta || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Tipo</Label>
                    <p className="font-medium capitalize">{colaborador.tipo_conta || '-'}</p>
                  </div>
                </div>

                {colaborador.pix_chave && (
                  <>
                    <Separator />
                    <div>
                      <Label className="text-muted-foreground">Chave PIX ({colaborador.pix_tipo})</Label>
                      <p className="font-medium">{colaborador.pix_chave}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Atualizar Contato</CardTitle>
                    <CardDescription>Mantenha seus dados de contato atualizados</CardDescription>
                  </div>
                  {!editingDados && (
                    <Button variant="outline" onClick={() => setEditingDados(true)}>
                      Editar
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {editingDados ? (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input 
                          id="telefone" 
                          value={dadosPessoais.telefone}
                          onChange={(e) => setDadosPessoais(prev => ({ ...prev, telefone: e.target.value }))}
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSalvarDados}>
                        Salvar
                      </Button>
                      <Button variant="outline" onClick={() => setEditingDados(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Clique em "Editar" para atualizar seus dados de contato.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
});
