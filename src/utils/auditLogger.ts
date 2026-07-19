import { supabase } from '@/integrations/supabase/client';

const PII_FIELDS = new Set([
  'cpf', 'pis', 'rg', 'senha', 'password', 'hash', 'token',
  'conta_bancaria', 'conta', 'agencia', 'numero_conta',
  'banco_agencia', 'banco_conta', 'chave_pix',
  'data_nascimento', 'nascimento',
]);

const PII_FIELD_PATTERNS = [
  /^cpf$/i, /^pis$/i, /^rg$/i, /senha/i, /password/i,
  /conta.?bancaria/i, /\bconta\b/i, /\bagencia\b/i, /chave.?pix/i,
  /data.?nasc/i, /^hash/i, /^token/i,
];

function isPiiField(key: string): boolean {
  if (PII_FIELDS.has(key.toLowerCase())) return true;
  return PII_FIELD_PATTERNS.some(p => p.test(key));
}

function maskValue(key: string, value: unknown): unknown {
  if (value === null || value === undefined) return value;
  const k = key.toLowerCase();
  if (/cpf/.test(k)) return '***.***.***-**';
  if (/pis/.test(k)) return '***.*****.***-*';
  if (/^rg/.test(k)) return '**.***.***-*';
  if (/conta|agencia|chave.?pix/.test(k)) {
    const s = String(value);
    return s.length > 4 ? '*'.repeat(s.length - 4) + s.slice(-4) : '****';
  }
  return '[MASKED]';
}

function maskPii(obj: unknown, depth = 0): unknown {
  if (depth > 8) return obj;
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(item => maskPii(item, depth + 1));
  if (typeof obj !== 'object') return obj;
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    result[k] = isPiiField(k) ? maskValue(k, v) : maskPii(v, depth + 1);
  }
  return result;
}

export const auditLogger = {
  async log(params: {
    tabela: string;
    registro_id: string;
    acao: 'INSERT' | 'UPDATE' | 'DELETE' | 'EXECUTE_CALC' | 'SIGN';
    dados_anteriores?: any;
    dados_novos?: any;
    user_id?: string;
    user_email?: string;
  }) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('audit_log').insert({
        tabela: params.tabela,
        registro_id: params.registro_id,
        acao: params.acao,
        dados_anteriores: params.dados_anteriores ? maskPii(params.dados_anteriores) as never : null,
        dados_novos: params.dados_novos ? maskPii(params.dados_novos) as never : null,
        user_id: params.user_id || user?.id,
        user_email: params.user_email || user?.email,
      });
      if (error) console.error('Audit log error:', error);
    } catch (e) {
      console.error('Audit log exception:', e);
    }
  }
};
