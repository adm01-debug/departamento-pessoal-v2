import { useState, useEffect, useRef, memo } from 'react';
import { logger } from '@/lib/logger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  AlertTriangle, 
  CheckCircle, 
  Settings, 
  TrendingUp, 
  Activity,
  Bell,
  BellOff,
  Loader2,
  Save,
  History
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AlertHistoryModal } from './AlertHistoryModal';

interface IndicatorLimits {
  turnoverWarning: number;
  turnoverCritical: number;
  absenteeismWarning: number;
  absenteeismCritical: number;
}

interface IndicatorAlertsCardProps {
  turnoverRate: number;
  absenteeismRate: number;
}

const DEFAULT_LIMITS: IndicatorLimits = {
  turnoverWarning: 10,
  turnoverCritical: 20,
  absenteeismWarning: 3,
  absenteeismCritical: 5,
};

type AlertLevel = 'ok' | 'warning' | 'critical';

interface Alert {
  id: string;
  indicator: string;
  tipo: string;
  message: string;
  level: AlertLevel;
  value: number;
  limit: number;
  icon: React.ElementType;
}

export const IndicatorAlertsCard = memo(function IndicatorAlertsCard({ 
  turnoverRate, 
  absenteeismRate
}: IndicatorAlertsCardProps) {
  const [limits, setLimits] = useState<IndicatorLimits>(DEFAULT_LIMITS);
  const [editingLimits, setEditingLimits] = useState<IndicatorLimits>(DEFAULT_LIMITS);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Track which alerts have been logged to avoid duplicates
  const loggedAlertsRef = useRef<Set<string>>(new Set());

  // Load limits from database
  useEffect(() => {
    async function loadLimits() {
      try {
        const { data, error } = await supabase
          .from('config_alertas_indicadores')
          .select('tipo, limite_atencao, limite_critico');

        if (error) throw error;

        if (data && data.length > 0) {
          const turnoverConfig = data.find(d => d.tipo === 'turnover');
          const absenteeismConfig = data.find(d => d.tipo === 'absenteismo');

          const loadedLimits: IndicatorLimits = {
            turnoverWarning: turnoverConfig?.limite_atencao ?? DEFAULT_LIMITS.turnoverWarning,
            turnoverCritical: turnoverConfig?.limite_critico ?? DEFAULT_LIMITS.turnoverCritical,
            absenteeismWarning: absenteeismConfig?.limite_atencao ?? DEFAULT_LIMITS.absenteeismWarning,
            absenteeismCritical: absenteeismConfig?.limite_critico ?? DEFAULT_LIMITS.absenteeismCritical,
          };

          setLimits(loadedLimits);
          setEditingLimits(loadedLimits);
        }
      } catch (error) {
        logger.error('Erro ao carregar limites:', error);
      } finally {
        setLoading(false);
      }
    }

    loadLimits();
  }, []);

  // Log alerts to history when they change
  useEffect(() => {
    if (loading) return;

    const logAlert = async (alert: Alert) => {
      const alertKey = `${alert.tipo}-${alert.level}`;
      
      // Check if this alert was already logged in this session
      if (loggedAlertsRef.current.has(alertKey)) return;
      
      try {
        const { error } = await supabase
          .from('historico_alertas')
          .insert({
            tipo: alert.tipo,
            nivel: alert.level,
            valor: alert.value,
            limite: alert.limit,
            mensagem: alert.message
          });

        if (error) throw error;
        
        // Mark as logged
        loggedAlertsRef.current.add(alertKey);
      } catch (error) {
        logger.error('Erro ao registrar alerta:', error);
      }
    };

    // Log active alerts
    alerts.forEach(alert => {
      if (alert.level !== 'ok') {
        logAlert(alert);
      }
    });
  }, [turnoverRate, absenteeismRate, limits, loading]);

  // Save limits to database
  const saveLimits = async () => {
    setSaving(true);
    try {
      // Update turnover limits
      const { error: turnoverError } = await supabase
        .from('config_alertas_indicadores')
        .update({
          limite_atencao: editingLimits.turnoverWarning,
          limite_critico: editingLimits.turnoverCritical
        })
        .eq('tipo', 'turnover');

      if (turnoverError) throw turnoverError;

      // Update absenteeism limits
      const { error: absenteeismError } = await supabase
        .from('config_alertas_indicadores')
        .update({
          limite_atencao: editingLimits.absenteeismWarning,
          limite_critico: editingLimits.absenteeismCritical
        })
        .eq('tipo', 'absenteismo');

      if (absenteeismError) throw absenteeismError;

      // Reset logged alerts when limits change so new alerts can be logged
      loggedAlertsRef.current.clear();
      
      setLimits(editingLimits);
      setSettingsOpen(false);
      toast.success('Limites salvos com sucesso!');
    } catch (error) {
      logger.error('Erro ao salvar limites:', error);
      toast.error('Erro ao salvar limites');
    } finally {
      setSaving(false);
    }
  };

  const getAlertLevel = (value: number, warningLimit: number, criticalLimit: number): AlertLevel => {
    if (value >= criticalLimit) return 'critical';
    if (value >= warningLimit) return 'warning';
    return 'ok';
  };

  const turnoverLevel = getAlertLevel(turnoverRate, limits.turnoverWarning, limits.turnoverCritical);
  const absenteeismLevel = getAlertLevel(absenteeismRate, limits.absenteeismWarning, limits.absenteeismCritical);

  const alerts: Alert[] = [];

  if (turnoverLevel === 'critical') {
    alerts.push({
      id: 'turnover-critical',
      indicator: 'Turnover',
      tipo: 'turnover',
      message: `Taxa de turnover crítica: ${turnoverRate.toFixed(1)}% (limite: ${limits.turnoverCritical}%)`,
      level: 'critical',
      value: turnoverRate,
      limit: limits.turnoverCritical,
      icon: TrendingUp
    });
  } else if (turnoverLevel === 'warning') {
    alerts.push({
      id: 'turnover-warning',
      indicator: 'Turnover',
      tipo: 'turnover',
      message: `Taxa de turnover em alerta: ${turnoverRate.toFixed(1)}% (limite: ${limits.turnoverWarning}%)`,
      level: 'warning',
      value: turnoverRate,
      limit: limits.turnoverWarning,
      icon: TrendingUp
    });
  }

  if (absenteeismLevel === 'critical') {
    alerts.push({
      id: 'absenteeism-critical',
      indicator: 'Absenteísmo',
      tipo: 'absenteismo',
      message: `Taxa de absenteísmo crítica: ${absenteeismRate.toFixed(1)}% (limite: ${limits.absenteeismCritical}%)`,
      level: 'critical',
      value: absenteeismRate,
      limit: limits.absenteeismCritical,
      icon: Activity
    });
  } else if (absenteeismLevel === 'warning') {
    alerts.push({
      id: 'absenteeism-warning',
      indicator: 'Absenteísmo',
      tipo: 'absenteismo',
      message: `Taxa de absenteísmo em alerta: ${absenteeismRate.toFixed(1)}% (limite: ${limits.absenteeismWarning}%)`,
      level: 'warning',
      value: absenteeismRate,
      limit: limits.absenteeismWarning,
      icon: Activity
    });
  }

  const getLevelColor = (level: AlertLevel) => {
    switch (level) {
      case 'critical': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'warning': return 'text-warning bg-warning/10 border-warning/20';
      default: return 'text-success bg-success/10 border-success/20';
    }
  };

  const getLevelBadge = (level: AlertLevel) => {
    switch (level) {
      case 'critical': return <Badge variant="destructive">Crítico</Badge>;
      case 'warning': return <Badge className="bg-warning text-warning-foreground">Alerta</Badge>;
      default: return <Badge className="bg-success text-success-foreground">Normal</Badge>;
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setEditingLimits(limits);
    }
    setSettingsOpen(open);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {alerts.length > 0 ? (
              <Bell className="w-5 h-5 text-warning animate-pulse" />
            ) : (
              <BellOff className="w-5 h-5 text-muted-foreground" />
            )}
            Alertas de Indicadores
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setHistoryOpen(true)}
              title="Histórico de alertas"
            >
              <History className="w-4 h-4" />
            </Button>
            <Popover open={settingsOpen} onOpenChange={handleOpenChange}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Configurar Limites</h4>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Turnover (%)</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Alerta</Label>
                          <Input 
                            type="number" 
                            value={editingLimits.turnoverWarning}
                            onChange={(e) => setEditingLimits({
                              ...editingLimits,
                              turnoverWarning: Number(e.target.value)
                            })}
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Crítico</Label>
                          <Input 
                            type="number" 
                            value={editingLimits.turnoverCritical}
                            onChange={(e) => setEditingLimits({
                              ...editingLimits,
                              turnoverCritical: Number(e.target.value)
                            })}
                            className="h-8"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Absenteísmo (%)</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Alerta</Label>
                          <Input 
                            type="number" 
                            value={editingLimits.absenteeismWarning}
                            onChange={(e) => setEditingLimits({
                              ...editingLimits,
                              absenteeismWarning: Number(e.target.value)
                            })}
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Crítico</Label>
                          <Input 
                            type="number" 
                            value={editingLimits.absenteeismCritical}
                            onChange={(e) => setEditingLimits({
                              ...editingLimits,
                              absenteeismCritical: Number(e.target.value)
                            })}
                            className="h-8"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={saveLimits}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Limites
                      </>
                    )}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent>
          {/* Status Overview */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className={`p-3 rounded-lg border ${getLevelColor(turnoverLevel)}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">Turnover</span>
                {getLevelBadge(turnoverLevel)}
              </div>
              <p className="text-xl font-bold">{turnoverRate.toFixed(1)}%</p>
              <p className="text-xs opacity-70">
                Limites: {limits.turnoverWarning}% / {limits.turnoverCritical}%
              </p>
            </div>
            <div className={`p-3 rounded-lg border ${getLevelColor(absenteeismLevel)}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">Absenteísmo</span>
                {getLevelBadge(absenteeismLevel)}
              </div>
              <p className="text-xl font-bold">{absenteeismRate.toFixed(1)}%</p>
              <p className="text-xs opacity-70">
                Limites: {limits.absenteeismWarning}% / {limits.absenteeismCritical}%
              </p>
            </div>
          </div>

          {/* Alert List */}
          {alerts.length > 0 ? (
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    alert.level === 'critical' 
                      ? 'bg-destructive/5 border-destructive/20' 
                      : 'bg-warning/5 border-warning/20'
                  }`}
                >
                  <div className={`p-1.5 rounded-full ${
                    alert.level === 'critical' 
                      ? 'bg-destructive/20 text-destructive' 
                      : 'bg-warning/20 text-warning'
                  }`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{alert.indicator}</p>
                    <p className="text-xs text-muted-foreground">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
              <CheckCircle className="w-10 h-10 mb-2 text-success" />
              <p className="text-sm font-medium">Todos os indicadores normais</p>
              <p className="text-xs">Nenhum alerta ativo no momento</p>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertHistoryModal open={historyOpen} onOpenChange={setHistoryOpen} />
    </>
  );
});
