import { useState, useCallback } from 'react';
import { Clock, Zap, Play, Pause, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAutoSync, AutoSyncConfig as AutoSyncConfigType, AutoSyncStatusBadge } from '@/hooks/useAutoSync';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface AutoSyncConfigProps {
  onConfigChange?: (config: AutoSyncConfigType) => void;
  showCard?: boolean;
}

export function AutoSyncConfigComponent({ onConfigChange, showCard = true }: AutoSyncConfigProps) {
  const { 
    config, 
    status, 
    toggleAutoSync, 
    executarSyncManual, 
    atualizarConfig,
    isUpdating 
  } = useAutoSync();

  const handleToggle = useCallback(async (enabled: boolean) => {
    await toggleAutoSync(enabled);
    onConfigChange?.({ ...config!, habilitado: enabled });
  }, [toggleAutoSync, onConfigChange, config]);

  const handleIntervalChange = useCallback(async (minutos: string) => {
    const novoConfig = { ...config!, intervalo_minutos: parseInt(minutos) };
    await atualizarConfig(novoConfig);
    onConfigChange?.(novoConfig);
  }, [config, atualizarConfig, onConfigChange]);

  const handleDiasSemanaChange = useCallback(async (dia: number, checked: boolean) => {
    const diasAtuais = config?.dias_semana || [1, 2, 3, 4, 5];
    const novosDias = checked 
      ? [...diasAtuais, dia].sort()
      : diasAtuais.filter(d => d !== dia);
    
    const novoConfig = { ...config!, dias_semana: novosDias };
    await atualizarConfig(novoConfig);
    onConfigChange?.(novoConfig);
  }, [config, atualizarConfig, onConfigChange]);

  const diasSemana = [
    { value: 0, label: 'Dom' },
    { value: 1, label: 'Seg' },
    { value: 2, label: 'Ter' },
    { value: 3, label: 'Qua' },
    { value: 4, label: 'Qui' },
    { value: 5, label: 'Sex' },
    { value: 6, label: 'Sáb' },
  ];

  const Content = () => (
    <div className="space-y-6">
      {/* Toggle Principal */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <Label className="font-medium">Sincronização Automática</Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Sincroniza dados automaticamente em intervalos regulares
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AutoSyncStatusBadge />
          <Switch
            checked={config?.habilitado || false}
            onCheckedChange={handleToggle}
            disabled={isUpdating}
          />
        </div>
      </div>

      {config?.habilitado && (
        <>
          <Separator />

          {/* Intervalo */}
          <div className="space-y-2">
            <Label>Intervalo de Sincronização</Label>
            <Select
              value={String(config.intervalo_minutos)}
              onValueChange={handleIntervalChange}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">A cada 15 minutos</SelectItem>
                <SelectItem value="30">A cada 30 minutos</SelectItem>
                <SelectItem value="60">A cada 1 hora</SelectItem>
                <SelectItem value="120">A cada 2 horas</SelectItem>
                <SelectItem value="360">A cada 6 horas</SelectItem>
                <SelectItem value="720">A cada 12 horas</SelectItem>
                <SelectItem value="1440">A cada 24 horas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dias da Semana */}
          <div className="space-y-2">
            <Label>Dias da Semana</Label>
            <div className="flex gap-2">
              {diasSemana.map(dia => (
                <Button
                  key={dia.value}
                  variant={config.dias_semana?.includes(dia.value) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleDiasSemanaChange(
                    dia.value, 
                    !config.dias_semana?.includes(dia.value)
                  )}
                  disabled={isUpdating}
                  className="w-10"
                >
                  {dia.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Status e Ações */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-medium">Status</p>
                {status.rodando ? (
                  <p className="text-sm text-info flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-info animate-pulse" />
                    Sincronizando...
                  </p>
                ) : status.proximaExecucao ? (
                  <p className="text-sm text-muted-foreground">
                    Próxima: {format(status.proximaExecucao, "dd/MM 'às' HH:mm", { locale: ptBR })}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Aguardando...</p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={executarSyncManual}
                disabled={status.rodando}
              >
                <Play className="w-4 h-4 mr-1" />
                Executar Agora
              </Button>
            </div>

            {status.ultimoResultado && (
              <div className="text-sm text-muted-foreground">
                Última sync: {status.ultimoResultado.sucesso} registros
                {status.ultimaExecucao && (
                  <span> ({format(status.ultimaExecucao, "dd/MM HH:mm", { locale: ptBR })})</span>
                )}
              </div>
            )}
          </div>

          {/* Opções Avançadas */}
          <Separator />
          <div className="space-y-3">
            <p className="text-sm font-medium">Opções</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Sincronizar Colaboradores</span>
                <Switch
                  checked={config.sync_colaboradores ?? true}
                  onCheckedChange={(checked) => 
                    atualizarConfig({ ...config, sync_colaboradores: checked })
                  }
                  disabled={isUpdating}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sincronizar Departamentos</span>
                <Switch
                  checked={config.sync_departamentos ?? true}
                  onCheckedChange={(checked) => 
                    atualizarConfig({ ...config, sync_departamentos: checked })
                  }
                  disabled={isUpdating}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Notificar Erros</span>
                <Switch
                  checked={config.notificar_erros ?? true}
                  onCheckedChange={(checked) => 
                    atualizarConfig({ ...config, notificar_erros: checked })
                  }
                  disabled={isUpdating}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (!showCard) return <Content />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configuração de Auto-Sync
        </CardTitle>
        <CardDescription>
          Configure a sincronização automática com sistemas externos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Content />
      </CardContent>
    </Card>
  );
}

export default AutoSyncConfigComponent;

