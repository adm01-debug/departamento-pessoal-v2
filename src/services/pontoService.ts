import { supabase } from '@/integrations/supabase/client';
import { pontoMonitorService } from './pontoMonitorService';
import CryptoJS from 'crypto-js';
import { format } from 'date-fns';

const ensureSingleResult = <T>(data: T | null, entity: string): T => {
  if (!data) throw new Error(`Nenhum registro de ${entity} foi retornado pela operação.`);
  return data;
};

// Utility to calculate distance between two points in meters
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export const pontoService = {
  async getSettings(empresaId: string) {
    const { data, error } = await supabase
      .from('configuracoes_ponto')
      .select('*')
      .eq('empresa_id', empresaId)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async registrar(
    tipo: 'entrada' | 'saida_almoco' | 'retorno_almoco' | 'saida', 
    colaboradorId: string,
    options?: {
      latitude?: number;
      longitude?: number;
      precisao?: number;
      dispositivoId?: string;
      metadata?: Record<string, any>;
    }
  ) {
    if (!colaboradorId) throw new Error('Colaborador é obrigatório para registrar ponto.');
    
    const now = new Date();
    const data = format(now, 'yyyy-MM-dd');
    const hora = format(now, 'HH:mm');
    
    const tipoMap: Record<string, string> = { 
      entrada: 'entrada', 
      saida_almoco: 'saida', 
      retorno_almoco: 'entrada', 
      saida: 'saida' 
    };

    // 1. Prevenção de duplicidade (mesmo tipo no mesmo minuto)
    const { data: duplicate } = await supabase
      .from('batidas_ponto')
      .select('id')
      .eq('colaborador_id', colaboradorId)
      .eq('data', data)
      .eq('hora', hora)
      .eq('tipo', tipoMap[tipo] || 'entrada')
      .maybeSingle();

    if (duplicate) {
      throw new Error('Já existe um registro idêntico para este horário. Aguarde um minuto.');
    }

    // Get colaborador and workplace info
    const { data: colab, error: colabError } = await supabase
      .from('colaboradores')
      .select('id, empresa_id, local_trabalho_id, locais_trabalho(latitude, longitude)')
      .eq('id', colaboradorId)
      .maybeSingle();

    if (colabError) throw colabError;
    if (!colab) throw new Error('Colaborador não encontrado.');

    // Check settings
    const settings = await this.getSettings(colab.empresa_id);
    let dentroRaio = true;

    if (settings?.exige_geolocalizacao && colab.locais_trabalho) {
      const workplace = colab.locais_trabalho as any;
      if (workplace.latitude && workplace.longitude && options?.latitude && options?.longitude) {
        const distance = getDistance(
          workplace.latitude, 
          workplace.longitude, 
          options.latitude, 
          options.longitude
        );
        dentroRaio = distance <= (settings.raio_maximo_metros || 200);
        
        if (!dentroRaio && settings.exige_geolocalizacao) {
          await pontoMonitorService.trackGeofenceFailure(
            colaboradorId, 
            options.latitude, 
            options.longitude, 
            settings.raio_maximo_metros || 200
          );
        }
      }
    }

    const hashPayload = `${colaboradorId}|${data}|${hora}|${options?.dispositivoId || 'web'}`;
    const hashIntegridade = CryptoJS.SHA256(hashPayload).toString();

    // Determine order - Buscar o último registro do dia para garantir a ordem correta
    const { data: lastPoint } = await supabase
      .from('batidas_ponto')
      .select('ordem')
      .eq('colaborador_id', colab.id)
      .eq('data', data)
      .order('ordem', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    const ordem = (lastPoint?.ordem || 0) + 1;

    // Insert RAW event
    const { data: batida, error: insertError } = await supabase
      .from('batidas_ponto')
      .insert({
        colaborador_id: colab.id,
        empresa_id: colab.empresa_id,
        data,
        hora,
        ordem,
        tipo: tipoMap[tipo] || 'entrada',
        origem: 'web',
        latitude: options?.latitude,
        longitude: options?.longitude,
        precisao_metros: options?.precisao,
        dispositivo_id: options?.dispositivoId || 'web-browser',
        dentro_raio: dentroRaio,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        versao_app: '2.0.0-perf',
        hash_integridade: hashIntegridade,
        audit_sha256: hashIntegridade,
        audit_conformidade: true,
        metadata: options?.metadata
      } as any)
      .select()
      .maybeSingle();

    if (insertError) throw insertError;
    return ensureSingleResult(batida, 'batida de ponto');
  },

  async buscarRegistroHoje(colaboradorId: string) {
    const today = format(new Date(), 'yyyy-MM-dd');
    const { data, error } = await supabase
      .from('batidas_ponto')
      .select('*')
      .eq('colaborador_id', colaboradorId)
      .eq('data', today)
      .order('ordem', { ascending: true });
    if (error) throw error;
    return data;
  },

  async buscarRegistrosSemana(colaboradorId: string) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { data, error } = await supabase
      .from('registros_ponto')
      .select('*')
      .eq('colaborador_id', colaboradorId)
      .gte('data', weekAgo.toISOString().split('T')[0])
      .order('data', { ascending: false });
    if (error) throw error;
    return data || [];
  },
};
