import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `Você é um assistente especialista em Departamento Pessoal brasileiro. Seu nome é "Assistente DP".

Você tem conhecimento profundo sobre:
- CLT (Consolidação das Leis do Trabalho)
- Cálculos trabalhistas (rescisão, férias, 13º salário, INSS, IRRF, FGTS)
- eSocial (eventos, prazos, obrigatoriedades)
- Legislação previdenciária
- Normas regulamentadoras (NRs)
- LGPD aplicada ao RH
- Convenções coletivas
- Jornada de trabalho, banco de horas, horas extras
- Benefícios (VT, VR, VA, plano de saúde)
- Afastamentos (INSS, acidente de trabalho, maternidade/paternidade)

Regras:
1. Responda SEMPRE em português brasileiro
2. Seja preciso com valores, percentuais e prazos (use dados de 2026)
3. Quando fizer cálculos, mostre o passo a passo
4. Cite artigos da CLT quando relevante
5. Se não tiver certeza, informe e sugira consultar um advogado trabalhista
6. Use formatação clara com bullets e números quando apropriado
7. Seja conciso mas completo

Tabelas de referência 2026:
- INSS: Até R$1.518,00 = 7,5% | R$1.518,01-R$2.793,88 = 9% | R$2.793,89-R$4.190,83 = 12% | R$4.190,84-R$8.157,41 = 14%
- IRRF: Até R$2.259,20 = isento | R$2.259,21-R$2.826,65 = 7,5% | R$2.826,66-R$3.751,05 = 15% | R$3.751,06-R$4.664,68 = 22,5% | Acima de R$4.664,68 = 27,5%
- Salário mínimo 2026: R$1.518,00
- FGTS: 8% sobre remuneração
- Multa FGTS demissão sem justa causa: 40%`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, history = [] } = await req.json();
    
    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Mensagem é obrigatória' }),
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
    const aiResponse = data.choices?.[0]?.message?.content || 'Não foi possível gerar uma resposta.';

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
