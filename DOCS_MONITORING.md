# Monitoramento e Alertas de Performance

Este sistema utiliza tabelas internas e views para monitorar o desempenho das Edge Functions e da fila de processamento.

## Métricas Disponíveis

As métricas são armazenadas na tabela `public.metricas_processamento`.

### View de Alertas: `v_alertas_timeout`

Esta view destaca funções que estão operando próximo ao limite de 60 segundos do Supabase Edge Functions.

| Coluna | Descrição |
|--------|-----------|
| `funcao_nome` | Nome da função que disparou o alerta. |
| `ocorrencias` | Número de vezes que o tempo excedeu 55s. |
| `media_ms` | Tempo médio de execução. |
| `ultima_ocorrencia` | Timestamp do evento mais recente. |

## Como Configurar Alertas

A tabela `public.configuracoes_alertas` permite definir limites customizados.

Exemplo de configuração (via SQL):
```sql
INSERT INTO configuracoes_alertas (metrica, threshold, email_notificacao)
VALUES ('timeout', 55000, 'admin@exemplo.com');
```

## Monitoramento da Fila (PGMQ)

Para acompanhar a saúde da fila de limpeza LGPD (`lgpd_fila_limpeza`):

1. **Backlog:**
   ```sql
   SELECT count(*) FROM lgpd_fila_limpeza WHERE status = 'pending';
   ```
2. **Tempo Médio na Fila:**
   ```sql
   SELECT avg(updated_at - created_at) FROM lgpd_fila_limpeza WHERE status = 'completed';
   ```

## Boas Práticas

1. **Logging:** Sempre use `console.time()` e `console.timeEnd()` dentro das functions para logs detalhados.
2. **Retentativas:** Funções que falham por timeout devem ser idempotentes para permitir retentativas automáticas.
3. **Escalabilidade:** Se o backlog da fila crescer constantemente, considere aumentar o paralelismo ou otimizar a query principal.
