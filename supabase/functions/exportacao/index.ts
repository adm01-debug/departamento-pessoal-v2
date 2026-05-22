import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const { action, format, empresaId, filters } = await req.json();

    switch (action) {
      case 'colaboradores': {
        let q = supabase.from('colaboradores').select('nome_completo, cpf, cargo, departamento, data_admissao, salario, status, email, telefone');
        if (empresaId) q = q.eq('empresa_id', empresaId);
        if (filters?.status) q = q.eq('status', filters.status);
        const { data, error } = await q;
        if (error) throw error;

        if (format === 'csv') {
          const hdr = 'Nome,CPF,Cargo,Departamento,Admissão,Salário,Status,Email,Telefone';
          const rows = (data || []).map((c: any) =>
            `"${c.nome_completo || ''}","${c.cpf || ''}","${c.cargo || ''}","${c.departamento || ''}","${c.data_admissao || ''}","${c.salario || ''}","${c.status || ''}","${c.email || ''}","${c.telefone || ''}"`
          );
          return new Response([hdr, ...rows].join('\n'), {
            headers: { ...corsHeaders, 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="colaboradores.csv"' },
          });
        }
        return new Response(JSON.stringify({ data, total: data?.length || 0 }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      case 'folha': {
        let q = supabase.from('folhas_pagamento').select('*, colaborador:colaboradores(nome_completo, cpf)');
        if (empresaId) q = q.eq('empresa_id', empresaId);
        if (filters?.competencia) q = q.eq('competencia', filters.competencia);
        const { data, error } = await q;
        if (error) throw error;
        if (format === 'csv') {
          const hdr = 'Nome,CPF,Competência,Bruto,INSS,IRRF,FGTS,Líquido';
          const rows = (data || []).map((f: any) =>
            `"${f.colaborador?.nome_completo || ''}","${f.colaborador?.cpf || ''}","${f.competencia}","${f.salario_bruto}","${f.desconto_inss}","${f.desconto_irrf}","${f.fgts}","${f.salario_liquido}"`
          );
          return new Response([hdr, ...rows].join('\n'), {
            headers: { ...corsHeaders, 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="folha.csv"' },
          });
        }
        return new Response(JSON.stringify({ data, total: data?.length || 0 }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      default:
        return new Response(JSON.stringify({ error: 'Ação inválida' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400,
        });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500,
    });
  }
});
