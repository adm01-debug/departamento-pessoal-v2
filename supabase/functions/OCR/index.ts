import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { fileUrl, bucket, filePath, documentType } = await req.json();

    if (!fileUrl && !(bucket && filePath)) {
      return new Response(JSON.stringify({ success: false, error: 'Forneça fileUrl ou bucket+filePath' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400,
      });
    }

    let imageUrl = fileUrl;
    if (bucket && filePath) {
      const { data: signedUrl } = await supabase.storage.from(bucket).createSignedUrl(filePath, 300);
      imageUrl = signedUrl?.signedUrl;
    }

    if (!imageUrl) {
      return new Response(JSON.stringify({ success: false, error: 'URL do arquivo não obtida' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400,
      });
    }

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      return new Response(JSON.stringify({ success: false, error: 'LOVABLE_API_KEY não configurada' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500,
      });
    }

    const prompts: Record<string, string> = {
      cpf: 'Extraia o número do CPF desta imagem. Retorne apenas o número no formato XXX.XXX.XXX-XX.',
      rg: 'Extraia os dados do RG: número, nome, filiação, data de nascimento, naturalidade.',
      ctps: 'Extraia os dados da CTPS: número, série, UF, data de emissão.',
      comprovante_endereco: 'Extraia o endereço completo: CEP, logradouro, número, bairro, cidade, UF.',
    };
    const prompt = prompts[documentType] || 'Extraia todo o texto visível desta imagem de documento.';

    const aiResponse = await fetch('https://api.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${lovableApiKey}` },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'user', content: [{ type: 'text', text: prompt }, { type: 'image_url', image_url: { url: imageUrl } }] }],
        max_tokens: 1000,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const extractedText = aiData.choices?.[0]?.message?.content || '';

    return new Response(JSON.stringify({
      success: true,
      documentType: documentType || 'generic',
      extractedText,
      timestamp: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500,
    });
  }
});
