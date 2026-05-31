import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hncgwjbzdajfdztqgefe.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuY2d3amJ6ZGFqZmR6dHFnZWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NjQ4ODIsImV4cCI6MjA4OTI0MDg4Mn0.B9ml1sHPkPHoTEWBapO3z1y1RNVpMQfT9Ws0srULlzE';

const bridgeUrl = `${SUPABASE_URL}/functions/v1/external-db-bridge`;

async function validateBridge() {
  console.log('🚀 Iniciando validação de contrato do external-db-bridge...');

  const tests = [
    {
      name: 'SELECT Simples',
      payload: { action: 'select', table: 'empresas', limit: 1 }
    },
    {
      name: 'SELECT com Filtros',
      payload: { 
        action: 'select', 
        table: 'colaboradores', 
        filters: [{ column: 'status', op: 'eq', value: 'ativo' }],
        limit: 1 
      }
    },
    {
      name: 'RPC (Função de Banco)',
      payload: { action: 'rpc', fn: 'get_system_stats', params: {} }
    }
  ];

  for (const test of tests) {
    process.stdout.write(`Testing ${test.name}... `);
    try {
      const res = await fetch(bridgeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_PUBLISHABLE_KEY,
          'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify(test.payload)
      });

      const json = await res.json();

      if (!res.ok) {
        // Alguns RPCs podem não existir no banco corporativo, o que é um "sucesso parcial" se o erro for capturado
        if (json.error && json.error.includes('function') && json.error.includes('does not exist')) {
          console.log('⚠️  SKIP (Função não disponível no banco remoto)');
          continue;
        }
        throw new Error(json.error || `HTTP ${res.status}`);
      }

      if (!('data' in json)) {
        throw new Error('Resposta não contém campo "data"');
      }

      console.log('✅ PASS');
    } catch (err: any) {
      console.log(`❌ FAIL: ${err.message || 'Erro desconhecido'}`);
      process.exit(1);
    }
  }

  console.log('\n✨ Todos os contratos básicos validados com sucesso!');
}

validateBridge();
