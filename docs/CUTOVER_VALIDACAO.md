# Checklist de Validação Pós-Cutover

Projeto novo: `frjbfeamybqsejlvmqbl` · Projeto antigo: `ciziytrrjjotlsjzshnm`

## Fase 1 — Preparo (você)

- [ ] Executar `/mnt/documents/migration/01_storage_buckets.sql` no SQL Editor do novo projeto
- [ ] Executar `/mnt/documents/migration/02_storage_policies.sql`
- [ ] Executar `/mnt/documents/migration/03_cron_jobs.sql`
- [ ] Recadastrar os 35 secrets listados em `04_secrets_checklist.md` (Dashboard → Edge Functions → Secrets)
- [ ] Restaurar schema + dados + auth users no novo projeto (dump do antigo)

## Fase 2 — Deploy de Edge Functions (você, uma vez)

```bash
supabase login
bash scripts/deploy-functions-novo-projeto.sh
```

O script itera `supabase/functions/*` e faz deploy no `frjbfeamybqsejlvmqbl`. Falhas são reportadas ao final e não interrompem as demais.

## Fase 3 — Validação automática (in-app)

Acesse `/admin/diagnostico-migracao` (admin only). A página roda:

- Ping em `external-db-bridge`, `healthcheck`, `metricas`
- Contagem head-only em `colaboradores`, `folhas_pagamento`, `user_roles`, `empresas`
- Listagem de `cron.job` (via bridge)
- Sinaliza cada item com badge verde/amarelo/vermelho

## Fase 4 — Smoke test manual

- [ ] Login com um usuário admin
- [ ] Abrir Dashboard e conferir números básicos
- [ ] Abrir `/admin/colaboradores` — lista carrega
- [ ] Abrir `/folha` — competência aparece
- [ ] Subir 1 documento em `/documentos` — storage responde

## Rollback

Reverter `.env`, `src/integrations/supabase/client.ts` e `supabase/config.toml` para o `project_id` antigo (`ciziytrrjjotlsjzshnm`). Nenhuma mudança destrutiva foi feita no antigo.

## Observação importante

Enquanto o Lovable Cloud continuar apontado para `ciziytrrjjotlsjzshnm`, novas migrations e deploys automáticos feitos pelo Lovable irão para o projeto antigo. Para trabalho novo no `frjbfeamybqsejlvmqbl`, use SQL Editor + CLI diretamente.
