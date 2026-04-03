import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ALLOWED_TABLES = [
  'colaboradores', 'departamentos', 'cargos', 'beneficios',
  'dependentes', 'contatos_emergencia', 'documentos',
];

function parseCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    if (values.length !== headers.length) continue;
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h] = values[idx]; });
    rows.push(row);
  }
  return rows;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, tabela, dados, formato, csvContent, empresaId } = await req.json();

    if (action === 'validar') {
      // Validate data before importing
      if (!tabela || !ALLOWED_TABLES.includes(tabela)) {
        return new Response(JSON.stringify({
          success: false,
          error: `Tabela inválida. Permitidas: ${ALLOWED_TABLES.join(', ')}`,
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });
      }

      let rows: Record<string, string>[] = [];
      if (formato === 'csv' && csvContent) {
        rows = parseCSV(csvContent);
      } else if (formato === 'json' && dados) {
        rows = Array.isArray(dados) ? dados : [dados];
      } else {
        throw new Error('Forneça csvContent (formato csv) ou dados (formato json)');
      }

      // Basic validation
      const errors: string[] = [];
      rows.forEach((row, idx) => {
        if (tabela === 'colaboradores') {
          if (!row.nome) errors.push(`Linha ${idx + 1}: nome é obrigatório`);
          if (!row.cpf && !row.email) errors.push(`Linha ${idx + 1}: cpf ou email é obrigatório`);
        }
        if (tabela === 'departamentos' && !row.nome) {
          errors.push(`Linha ${idx + 1}: nome é obrigatório`);
        }
      });

      return new Response(JSON.stringify({
        success: true,
        data: { total: rows.length, errors, valid: errors.length === 0, preview: rows.slice(0, 5) },
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } else if (action === 'importar') {
      if (!tabela || !ALLOWED_TABLES.includes(tabela)) {
        throw new Error(`Tabela inválida. Permitidas: ${ALLOWED_TABLES.join(', ')}`);
      }

      let rows: Record<string, any>[] = [];
      if (formato === 'csv' && csvContent) {
        rows = parseCSV(csvContent);
      } else if (dados) {
        rows = Array.isArray(dados) ? dados : [dados];
      }

      if (rows.length === 0) throw new Error('Nenhum dado para importar');

      // Add empresa_id if provided
      if (empresaId) {
        rows = rows.map(r => ({ ...r, empresa_id: empresaId }));
      }

      // Insert in batches of 50
      let inserted = 0;
      let errorsCount = 0;
      const batchErrors: string[] = [];

      for (let i = 0; i < rows.length; i += 50) {
        const batch = rows.slice(i, i + 50);
        const { data, error } = await supabase.from(tabela).insert(batch).select('id');
        if (error) {
          errorsCount += batch.length;
          batchErrors.push(`Batch ${Math.floor(i / 50) + 1}: ${error.message}`);
        } else {
          inserted += data?.length || 0;
        }
      }

      // Log audit
      await supabase.from('audit_log').insert({
        tabela,
        registro_id: 'bulk-import',
        acao: 'IMPORT',
        dados_novos: { total: rows.length, inserted, errors: errorsCount },
      });

      return new Response(JSON.stringify({
        success: true,
        data: { total: rows.length, inserted, errors: errorsCount, details: batchErrors },
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } else if (action === 'template') {
      // Return CSV template for a table
      const templates: Record<string, string> = {
        colaboradores: 'nome,cpf,email,telefone,data_nascimento,data_admissao,cargo,departamento,salario',
        departamentos: 'nome,descricao',
        cargos: 'nome,cbo,salario_base',
        beneficios: 'nome,tipo,valor,valor_empresa,valor_colaborador',
      };

      const template = templates[tabela] || 'campo1,campo2,campo3';

      return new Response(JSON.stringify({ success: true, data: { template, tabela } }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: false, error: 'Ação inválida. Use: validar, importar, template' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500,
    });
  }
});
