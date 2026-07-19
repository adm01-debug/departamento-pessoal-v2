import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `Voce e um assistente especialista em Departamento Pessoal brasileiro. Seu nome e "Assistente DP".

Voce tem conhecimento profundo sobre:
- CLT (Consolidacao das Leis do Trabalho)
- Calculos trabalhistas (rescisao, ferias, 13o salario, INSS, IRRF, FGTS)
- eSocial (eventos, prazos, obrigatoriedades)
- Legislacao previdenciaria
- Normas regulamentadoras (NRs)
- LGPD aplicada ao RH
- Convencoes coletivas
- Jornada de trabalho, banco de horas, horas extras
- Beneficios (VT, VR, VA, plano de saude)
- Afastamentos (INSS, acidente de trabalho, maternidade/paternidade)

Regras:
1. Responda SEMPRE em portugues brasileiro
2. Seja preciso com valores, percentuais e prazos (use dados de 2026)
3. Quando fizer calculos, mostre o passo a passo
4. Cite artigos da CLT quando relevante
5. Se nao tiver certeza, informe e sugira consultar um advogado trabalhista
6. Use formatacao clara com bullets e numeros quando apropriado
7. Seja conciso mas completo

Tabelas de referencia 2026:
- INSS: Ate R$1.518,00 = 7,5% | R$1.518,01-R$2.793,88 = 9% | R$2.793,89-R$4.190,83 = 12% | R$4.190,84-R$8.157,41 = 14%
- IRRF: Ate R$2.259,20 = isento | R$2.259,21-R$2.826,65 = 7,5% | R$2.826,66-R$3.751,05 = 15% | R$3.751,06-R$4.664,68 = 22,5% | Acima de R$4.664,68 = 27,5%
- Salario minimo 2026: R$1.518,00
- FGTS: 8% sobre remuneracao
- Multa FGTS demissao sem justa causa: 40%`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    // JWT Authentication
    const authHeader = req.headers.get('Authorization') ?? '';
    if (!authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Autenticacao obrigatoria' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(
        JSON.stringify({ error: 'Sessao invalida' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { message, history = [] } = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Mensagem e obrigatoria' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-10),
      { role: 'user', content: message },
    ];

    const response = await fetch('https://ai-gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        max_tokens: 2048,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`AI API error [${response.status}]: ${errText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'Nao foi possivel gerar uma resposta.';

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Assistente IA error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
