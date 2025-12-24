import { SEOHead } from '@/components/SEOHead';
import { useState, useEffect, useEffect } from 'react';
import { 
  Bell, Check, CheckCheck, Trash2, Filter, 
  RefreshCw, Loader2, Info, AlertTriangle, 
  CheckCircle, XCircle, Calendar, Gift, UserPlus, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotificacoes, TipoNotificacao, Notificacao } from '@/hooks/useNotificacoes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const tipoIcons: Record<TipoNotificacao, any> = {
  info: Info,
  sucesso: CheckCircle,
  alerta: AlertTriangle,
  erro: XCircle,
  ferias_vencendo: Calendar,
  afastamento: Calendar,
  aniversario: Gift,
  admissao: UserPlus,
  desligamento: LogOut,
  folha: Info,
  ponto: Info,
  sync: RefreshCw,
};

const tipoColors: Record<TipoNotificacao, string> = {
  info: 'text-info',
  sucesso: 'text-success',
  alerta: 'text-warning',
  erro: 'text-destructive',
  ferias_vencendo: 'text-warning',
  afastamento: 'text-info',
  aniversario: 'text-success',
  admissao: 'text-success',
  desligamento: 'text-destructive',
  folha: 'text-info',
  ponto: 'text-info',
  sync: 'text-info',
};

export default function Notificacoes() {
  useEffect(() => {
    document.title = 'Notificações | DP System';
  }, []);

  const [tab, setTab] = useState<'todas' | 'nao_lidas'>('nao_lidas');
  const [pagina, setPagina] = useState(1);

  const { 
    naoLidas, 
    loadingNaoLidas, 
    contadorNaoLidas,
    useTodas,
    marcarLida, 
    marcarTodasLidas, 
    excluirNotificacao 
  } = useNotificacoes();

  const { data: todasData, isLoading: loadingTodas } = useTodas(pagina, 20);

  const notificacoes = tab === 'nao_lidas' ? naoLidas : todasData?.data;
  const loading = tab === 'nao_lidas' ? loadingNaoLidas : loadingTodas;

  const handleMarcarLida = async (id: string) => {
    await marcarLida(id);
  };

  const handleExcluir = async (id: string) => {
    await excluirNotificacao(id);
  };

  return (
      <>
        <SEOHead title="Notificações" description="Central de notificações" />
        <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notificações</h1>
          <p className="text-muted-foreground">
            {contadorNaoLidas > 0 
              ? `${contadorNaoLidas} notificação(ões) não lida(s)` 
              : 'Nenhuma notificação pendente'
            }
          </p>
        </div>
        {contadorNaoLidas > 0 && (
          <Button aria-label="Ação" variant="outline" onClick={() => marcarTodasLidas()}>
            <CheckCheck className="w-4 h-4 mr-2" />
            Marcar Todas como Lidas
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v: unknown) => setTab(v)}>
        <TabsList>
          <TabsTrigger value="nao_lidas">
            Não Lidas
            {contadorNaoLidas > 0 && (
              <Badge variant="destructive" className="ml-2">{contadorNaoLidas}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="todas">Todas</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : !notificacoes || notificacoes.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    {tab === 'nao_lidas' 
                      ? 'Nenhuma notificação não lida' 
                      : 'Nenhuma notificação encontrada'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notificacoes.map((notif: Notificacao) => {
                    const Icon = tipoIcons[notif.tipo] || Info;
                    const colorClass = tipoColors[notif.tipo] || 'text-muted-foreground';
                    
                    return (
                      <div 
                        key={notif.id} 
                        className={cn(
                          "flex items-start gap-4 p-4 border rounded-lg transition-colors",
                          !notif.lida && "bg-muted/50 border-primary/20"
                        )}
                      >
                        <Icon className={cn("w-5 h-5 mt-0.5 flex-shrink-0", colorClass)} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className={cn("font-medium", !notif.lida && "text-primary")}>
                                {notif.titulo}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notif.mensagem}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {!notif.lida && (
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleMarcarLida(notif.id)}
                                  title="Marcar como lida"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleExcluir(notif.id)}
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {format(new Date(notif.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Paginação para Todas */}
              {tab === 'todas' && todasData && todasData.total > 20 && (
                <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={pagina === 1}
                    onClick={() => setPagina(p => p - 1)}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Página {pagina} de {Math.ceil(todasData.total / 20)}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={pagina >= Math.ceil(todasData.total / 20)}
                    onClick={() => setPagina(p => p + 1)}
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  
      </>);
}






