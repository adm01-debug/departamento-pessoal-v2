import { useCallback, useRef } from 'react';

/**
 * Gera uma `Idempotency-Key` estável por INTENÇÃO do usuário.
 *
 * Contrato:
 * - `key(intent)` retorna a MESMA chave para o mesmo `intent` até `reset(intent)`
 *   ou `resetAll()`. Cliques repetidos no mesmo botão (mesma intenção) reutilizam
 *   a chave → o servidor responde `REPLAY`/`IN_PROGRESS` em vez de recalcular.
 * - Ao trocar a chave semântica (empresa+competência), passe um `intent` novo
 *   (ex.: `${empresaId}:${competencia}`) — o hook gera automaticamente uma
 *   nova chave.
 * - Após conclusão bem-sucedida, chame `reset(intent)` para permitir uma nova
 *   operação legítima do usuário (recalcular após ajuste).
 *
 * Uso:
 *   const { key, reset } = useIdempotencyKey();
 *   const intent = `${empresaId}:${competencia}`;
 *   await calcularFolha({ empresaId, competencia, idempotencyKey: key(intent) });
 *   reset(intent); // habilita nova operação após sucesso
 */
export function useIdempotencyKey() {
  const map = useRef<Map<string, string>>(new Map());

  const key = useCallback((intent: string): string => {
    const existing = map.current.get(intent);
    if (existing) return existing;
    const fresh = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    // Normaliza para o formato aceito pelo helper server-side (16..128 alfanuméricos)
    const normalized = fresh.replace(/-/g, '').slice(0, 32);
    map.current.set(intent, normalized);
    return normalized;
  }, []);

  const reset = useCallback((intent: string) => {
    map.current.delete(intent);
  }, []);

  const resetAll = useCallback(() => {
    map.current.clear();
  }, []);

  return { key, reset, resetAll };
}
