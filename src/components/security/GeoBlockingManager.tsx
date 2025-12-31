import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Globe, Plus, Trash2, Shield, AlertTriangle, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Lista de países com códigos ISO
const COUNTRIES = [
  { code: 'BR', name: 'Brasil' },
  { code: 'PT', name: 'Portugal' },
  { code: 'US', name: 'Estados Unidos' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colômbia' },
  { code: 'MX', name: 'México' },
  { code: 'UY', name: 'Uruguai' },
  { code: 'PY', name: 'Paraguai' },
  { code: 'PE', name: 'Peru' },
  { code: 'EC', name: 'Equador' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'BO', name: 'Bolívia' },
  { code: 'ES', name: 'Espanha' },
  { code: 'FR', name: 'França' },
  { code: 'DE', name: 'Alemanha' },
  { code: 'IT', name: 'Itália' },
  { code: 'GB', name: 'Reino Unido' },
  { code: 'CA', name: 'Canadá' },
  { code: 'JP', name: 'Japão' },
  { code: 'CN', name: 'China' },
  { code: 'AU', name: 'Austrália' },
  { code: 'NZ', name: 'Nova Zelândia' },
  { code: 'ZA', name: 'África do Sul' },
  { code: 'IN', name: 'Índia' },
  { code: 'RU', name: 'Rússia' },
  { code: 'KR', name: 'Coreia do Sul' },
  { code: 'AE', name: 'Emirados Árabes' },
  { code: 'IL', name: 'Israel' },
  { code: 'SG', name: 'Singapura' },
];

interface AllowedCountry {
  id: string;
  country_code: string;
  country_name: string;
  created_at: string;
}

interface GeoConfig {
  id: string;
  enabled: boolean;
  block_unknown_countries: boolean;
  log_blocked_attempts: boolean;
}

interface BlockedAttempt {
  id: string;
  ip_address: string;
  country_code: string | null;
  country_name: string | null;
  user_agent: string | null;
  created_at: string;
}

export function GeoBlockingManager() {
  const [config, setConfig] = useState<GeoConfig | null>(null);
  const [allowedCountries, setAllowedCountries] = useState<AllowedCountry[]>([]);
  const [blockedAttempts, setBlockedAttempts] = useState<BlockedAttempt[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar configuração
      const { data: configData } = await supabase
        .from('geo_blocking_config')
        .select('*')
        .single();
      
      if (configData) {
        setConfig(configData);
      }

      // Carregar países permitidos
      const { data: countriesData } = await supabase
        .from('geo_allowed_countries')
        .select('*')
        .order('country_name');
      
      if (countriesData) {
        setAllowedCountries(countriesData);
      }

      // Carregar tentativas bloqueadas
      const { data: attemptsData } = await supabase
        .from('geo_blocked_attempts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (attemptsData) {
        setBlockedAttempts(attemptsData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (field: keyof GeoConfig, value: boolean) => {
    if (!config) return;
    
    try {
      setSaving(true);
      const { error } = await supabase
        .from('geo_blocking_config')
        .update({ [field]: value, updated_at: new Date().toISOString() })
        .eq('id', config.id);

      if (error) throw error;

      setConfig({ ...config, [field]: value });
      toast.success('Configuração atualizada');
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      toast.error('Erro ao atualizar configuração');
    } finally {
      setSaving(false);
    }
  };

  const addCountry = async () => {
    if (!selectedCountry) {
      toast.error('Selecione um país');
      return;
    }

    const country = COUNTRIES.find(c => c.code === selectedCountry);
    if (!country) return;

    if (allowedCountries.some(c => c.country_code === selectedCountry)) {
      toast.error('País já está na lista');
      return;
    }

    try {
      setSaving(true);
      const { data, error } = await supabase
        .from('geo_allowed_countries')
        .insert({
          country_code: country.code,
          country_name: country.name
        })
        .select()
        .single();

      if (error) throw error;

      setAllowedCountries([...allowedCountries, data]);
      setSelectedCountry('');
      toast.success(`${country.name} adicionado à whitelist`);
    } catch (error) {
      console.error('Erro ao adicionar:', error);
      toast.error('Erro ao adicionar país');
    } finally {
      setSaving(false);
    }
  };

  const removeCountry = async (id: string, name: string) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('geo_allowed_countries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAllowedCountries(allowedCountries.filter(c => c.id !== id));
      toast.success(`${name} removido da whitelist`);
    } catch (error) {
      console.error('Erro ao remover:', error);
      toast.error('Erro ao remover país');
    } finally {
      setSaving(false);
    }
  };

  const clearBlockedAttempts = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('geo_blocked_attempts')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) throw error;

      setBlockedAttempts([]);
      toast.success('Logs limpos');
    } catch (error) {
      console.error('Erro ao limpar:', error);
      toast.error('Erro ao limpar logs');
    } finally {
      setSaving(false);
    }
  };

  const availableCountries = COUNTRIES.filter(
    c => !allowedCountries.some(ac => ac.country_code === c.code)
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Configuração Global */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <CardTitle>Bloqueio Geográfico</CardTitle>
          </div>
          <CardDescription>
            Configure a whitelist de países permitidos para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
            <div className="space-y-1">
              <Label className="text-base font-medium">Ativar Bloqueio Geográfico</Label>
              <p className="text-sm text-muted-foreground">
                Apenas países na whitelist poderão acessar o sistema
              </p>
            </div>
            <Switch
              checked={config?.enabled ?? false}
              onCheckedChange={(checked) => updateConfig('enabled', checked)}
              disabled={saving}
            />
          </div>

          {config?.enabled && allowedCountries.length === 0 && (
            <div className="flex items-center gap-2 p-4 rounded-lg border border-destructive/50 bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">
                Atenção: Nenhum país na whitelist! Adicione pelo menos um país para não bloquear todos os acessos.
              </p>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-1">
                <Label>Bloquear países desconhecidos</Label>
                <p className="text-xs text-muted-foreground">
                  Bloquear quando não for possível identificar o país
                </p>
              </div>
              <Switch
                checked={config?.block_unknown_countries ?? true}
                onCheckedChange={(checked) => updateConfig('block_unknown_countries', checked)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-1">
                <Label>Registrar tentativas bloqueadas</Label>
                <p className="text-xs text-muted-foreground">
                  Manter log de acessos bloqueados
                </p>
              </div>
              <Switch
                checked={config?.log_blocked_attempts ?? true}
                onCheckedChange={(checked) => updateConfig('log_blocked_attempts', checked)}
                disabled={saving}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="whitelist">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="whitelist" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Países Permitidos ({allowedCountries.length})
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Tentativas Bloqueadas ({blockedAttempts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="whitelist">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Whitelist de Países</CardTitle>
              <CardDescription>
                Adicione os países que podem acessar o sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Adicionar país */}
              <div className="flex gap-2">
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Selecione um país" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCountries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <span className="flex items-center gap-2">
                          <span>{country.code}</span>
                          <span>{country.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={addCountry} disabled={saving || !selectedCountry}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>

              {/* Lista de países */}
              {allowedCountries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Nenhum país na whitelist</p>
                  <p className="text-sm text-muted-foreground">
                    Adicione países para permitir o acesso
                  </p>
                </div>
              ) : (
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                  {allowedCountries.map((country) => (
                    <div
                      key={country.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card"
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{country.country_code}</Badge>
                        <span className="font-medium">{country.country_name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCountry(country.id, country.country_name)}
                        disabled={saving}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Tentativas Bloqueadas</CardTitle>
                <CardDescription>
                  Histórico de acessos bloqueados por localização geográfica
                </CardDescription>
              </div>
              {blockedAttempts.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearBlockedAttempts} disabled={saving}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpar Logs
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {blockedAttempts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Shield className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Nenhuma tentativa bloqueada</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead>País</TableHead>
                      <TableHead>User Agent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blockedAttempts.map((attempt) => (
                      <TableRow key={attempt.id}>
                        <TableCell>
                          {format(new Date(attempt.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {attempt.ip_address}
                          </code>
                        </TableCell>
                        <TableCell>
                          {attempt.country_code ? (
                            <Badge variant="destructive">
                              {attempt.country_code} - {attempt.country_name || 'Desconhecido'}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Desconhecido</Badge>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {attempt.user_agent || '-'}
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
    </div>
  );
}
