import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { fileUrl, docType } = await req.json();

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not found');
    }

    const systemPrompt = `Você é um especialista em OCR de documentos brasileiros (RG, CPF, CNH, Comprovante de Residência).
    Sua tarefa é extrair os dados do documento fornecido e retornar APENAS um objeto JSON estruturado.
    Não inclua explicações ou texto fora do JSON.
    
    Campos esperados no JSON:
    - valid: boolean (indica se o documento é legível e do tipo correto)
    confidence: number (0-1)
    - extractedData: {
        nome?: string,
        cpf?: string (formatado),
        data_nascimento?: string (YYYY-MM-DD),
        rg?: string,
        logradouro?: string,
        bairro?: string,
        cidade?: string,
        uf?: string,
        cep?: string
      }
    - error?: string (se valid for false)`;

    const userPrompt = `Analise este documento do tipo: ${docType}.`;

    const aiResponse = await fetch('https://api.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${lovableApiKey}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: [
              { type: 'text', text: userPrompt },
              { type: 'image_url', image_url: { url: fileUrl } }
            ] 
          }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 1000,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || '{}';
    
    // Parse to ensure it's valid JSON
    const result = JSON.parse(content);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error:', error.message);
    return new Response(JSON.stringify({ 
      valid: false, 
      confidence: 0, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200, // Return 200 so the frontend can handle the error object
    });
  }
});
