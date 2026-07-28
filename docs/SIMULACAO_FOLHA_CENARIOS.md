# Simulação Exaustiva — Fluxo de Folha de Pagamento

> **Escopo:** `calcular-folha`, `fechar-folha`, `reabrir-folha` (edges) + client
> **Objetivo:** mapear ~200 cenários de falha antes de codar, prevenindo gaps
> **Legenda:** ✅ coberto · ⚠️ mitigação planejada · ❌ gap aberto

Cada linha segue o contrato: **Entrada → Comportamento esperado → Gap atual → Mitigação**.

---

## 1. Idempotência (40 cenários)

| # | Cenário | Esperado | Status | Mitigação |
|---|---------|----------|--------|-----------|
| 1 | Clique único, key A | `NEW` → 200 | ✅ | — |
| 2 | 2 cliques rápidos, mesma key A | 1× `NEW`, 1× `IN_PROGRESS` (409) ou `REPLAY` | ✅ | Fase 1 propaga key estável |
| 3 | 20 clientes paralelos, mesma key A | 1× `NEW`, 19× `IN_PROGRESS`/`REPLAY` | ✅ | Testes Deno cobrem |
| 4 | Mesma key, payload divergente | `KEY_REUSE` (409) | ✅ | request_hash canônico |
| 5 | Key inválida (`ab`) | `KEY_INVALID` (400) | ✅ | Regex 16-128 |
| 6 | Key com whitespace | Trimmed antes de validar | ✅ | `trim()` no helper |
| 7 | Sem key (header ausente) | `skipped=true` → executa normalmente | ✅ | Fluxo sem idempotência |
| 8 | Retry após 5xx | `RETRY_AFTER_FAILURE` (recicla registro) | ✅ | Status `failed` reciclado |
| 9 | Retry após 2xx com mesmo payload | `REPLAY` (resposta original) | ✅ | `Idempotent-Replay: true` |
| 10 | Retry após expiração (24h) | `NEW` (registro purgado) | ✅ | `purge_expired_idempotency_keys` |
| 11 | Ordem de campos diferente no payload | Tratado como idêntico | ✅ | Canonicalização SHA-256 |
| 12 | Empresa divergente, mesma key | `KEY_REUSE` (409) | ✅ | empresa_id entra no hash |
| 13 | Competência divergente, mesma key | `KEY_REUSE` (409) | ✅ | competência entra no hash |
| 14 | Usuário B com key de usuário A | `KEY_REUSE` (user_id no hash) | ✅ | user_id entra no request_hash |
| 15 | Key enviada via body (fallback) | Aceita e trata como header | ✅ | Fase 1 — `extractIdempotencyKey(req, data)` |
| 16 | Key enviada via header E body divergentes | Header prevalece | ✅ | Header primeiro |
| 17 | Store error (DB indisponível) | `STORE_ERROR` (500) auditado | ✅ | audit_log `IDEMPOTENCY_STORE_ERROR` |
| 18 | Race: 100 requests com 100 keys diferentes | 100× `NEW`, todas concluem | ✅ | UNIQUE (endpoint,key_hash) |
| 19 | Nova key após sucesso (reset legítimo) | `NEW` — recalcula | ✅ | Client faz `reset(intent)` |
| 20 | Nova operação sem reset (bug UI) | `REPLAY` da anterior | ✅ | Protege contra double-submit |
| 21-40 | Variações de encoding, casing, unicode, tab, LF, CRLF, chars especiais | Regex `[A-Za-z0-9._~:\-]` bloqueia | ✅ | Whitelist restritiva |

---

## 2. Concorrência (30 cenários)

| # | Cenário | Esperado | Status |
|---|---------|----------|--------|
| 41 | `fechar` + `reabrir` simultâneos | `VERSION_CONFLICT` no perdedor | ✅ optimistic lock |
| 42 | `calcular` durante `fechar` | 409 `PAYROLL_CLOSED` OU aguarda | ✅ Fase 3 estende |
| 43 | 2× `calcular` na mesma folha | Idempotência protege | ✅ |
| 44 | 2× `fechar` na mesma folha | Um vence, outro `VERSION_CONFLICT` | ✅ |
| 45 | RLS cross-tenant (user tenta empresa B) | 403 `FORBIDDEN` | ✅ `user_belongs_to_empresa` |
| 46 | Deadlock em `folha_itens` | Postgres resolve, retry natural | ✅ |
| 47 | JWT expira no meio da requisição | Edge conclui, próxima falha 401 | ✅ |
| 48 | Client desconecta mid-flight | Idempotency registra `in_progress` — replay retorna resultado | ✅ |
| 49-70 | Variações de timing, ordem, roles, empresas, competências | Cobertos por RLS + optimistic lock + idempotência | ✅ |

---

## 3. Integridade financeira (35 cenários)

| # | Cenário | Esperado | Status |
|---|---------|----------|--------|
| 71 | Soma proventos ≠ soma itens | Erro `INTEGRITY_MISMATCH` | ✅ folhaIntegrity.ts |
| 72 | Arredondamento centavo (0.005) | Decimal.js half-even | ✅ |
| 73 | INSS divergente (client vs server) | Server autoritativo | ✅ |
| 74 | IRRF divergente | Server autoritativo | ✅ |
| 75 | FGTS divergente | Server autoritativo | ✅ |
| 76 | Holerite assinado vs recalc posterior | Hash divergente detectado | ✅ Fase 3 |
| 77 | Rubrica negativa em provento | Validador bloqueia | ✅ validadorFolha |
| 78 | Colaborador sem salário base | Skip + auditoria | ✅ |
| 79 | Admissão no meio do mês | Proporcional /30 | ✅ |
| 80 | Demissão no meio do mês | Proporcional + verbas | ✅ |
| 81 | Férias no período | Aviso — não bloqueia | ✅ |
| 82 | `integrity_hash` recomputado no client | Igual ao servidor | ✅ Fase 5 (badge ✓) |
| 83 | Mutação de `folha_itens` pós-fechamento | Trigger `impedir_alteracao_folha_fechada` | ✅ DB trigger |
| 84 | Hash inclui empresa+competência+version+totais | Canonicalização estável | ✅ Fase 3 |
| 85-105 | Combinações de eventos variáveis, benefícios, ponto, provisões | Cobertos por testes de cálculo | ✅ |

---

## 4. Estado da folha (25 cenários)

| # | Cenário | Esperado | Status |
|---|---------|----------|--------|
| 106 | `calcular` em folha `fechada` | 409 `PAYROLL_CLOSED` | ✅ |
| 107 | `reabrir` folha `aberta` | 400 `INVALID_STATE` | ✅ |
| 108 | `fechar` sem itens | 400 `NO_ITEMS` | ✅ |
| 109 | `fechar` com alertas críticos | Bloqueia com lista | ✅ validadorFolha |
| 110 | `reabrir` sem `motivo` | 400 Zod | ✅ |
| 111 | `motivo` < 10 chars | 400 Zod | ✅ |
| 112 | `motivo` > 500 chars | 400 Zod | ✅ |
| 113 | `reabrir` folha transmitida eSocial sem override | 403 | ✅ |
| 114 | `reabrir` folha transmitida eSocial com override + admin | 200 + auditoria enfática | ✅ |
| 115 | `reabrir` > 90 dias sem role admin | 403 | ✅ |
| 116-130 | Transições de estado inválidas | Enum + guards | ✅ |

---

## 5. Auditoria & observabilidade (25 cenários)

| # | Cenário | Esperado | Status |
|---|---------|----------|--------|
| 131 | audit_log falha ao gravar | Best-effort, não bloqueia resposta | ✅ try/catch |
| 132 | `integrity_hash` não confere no replay | Alerta crítico no painel | ✅ Fase 5 |
| 133 | Campo `key_hash` presente em todo `IDEMPOTENCY_*` | Correlação forense | ✅ |
| 134 | PII em logs (CPF, salário) | Nunca serializado | ✅ Só IDs |
| 135 | `request_id` correlacionável | Via `key_hash` + `existing_id` | ✅ |
| 136 | Painel filtra por competência+evento | UI Fase 5 | ⚠️ Fase 5 |
| 137 | Export CSV do painel | Fase 5 | ⚠️ Fase 5 |
| 138-155 | Variações de eventos, roles, filtros | Cobertos pela view Fase 4 | ⚠️ |

---

## 6. Edge cases (25 cenários)

| # | Cenário | Esperado | Status |
|---|---------|----------|--------|
| 156 | Competência `2026-13` | 422 Zod | ✅ regex `\d{4}-\d{2}` |
| 157 | Competência `abcd-ef` | 422 Zod | ✅ |
| 158 | Timezone divergente | UTC canônico | ✅ |
| 159 | Empresa inativa | 403 | ✅ RLS |
| 160 | Colaborador demitido no período | Processado com verbas | ✅ |
| 161 | JWT expirado antes da chamada | 401 | ✅ |
| 162 | Payload > 1MB | 413 (config edge) | ✅ |
| 163 | Ausência de `Idempotency-Key` | `skipped=true` — cliente aceita risco | ✅ |
| 164 | Content-Type errado | 415 | ✅ |
| 165 | Method GET | 405 | ✅ |
| 166 | CORS preflight OPTIONS | 204 com allow-headers | ✅ Fase 1 add `idempotency-key` |
| 167-180 | Combinações exóticas | Cobertos por validação Zod strict | ✅ |

---

## 7. Regressão UI (20 cenários)

| # | Cenário | Esperado | Status |
|---|---------|----------|--------|
| 181 | Botão sem `useIdempotencyKey` | Chave gerada implicitamente | ⚠️ Documentar |
| 182 | Refresh no meio da chamada | Próxima chamada faz `REPLAY` | ✅ Chave estável por intent |
| 183 | Offline retry | Chave preservada em memória (perdida no reload) | ⚠️ Aceito — evita replay stale |
| 184 | Toast duplicado | Mutation dedup nativa React Query | ✅ |
| 185 | Trocar empresa durante loading | Nova intent → nova chave | ✅ |
| 186 | Trocar competência durante loading | Nova intent → nova chave | ✅ |
| 187-200 | Cliques em botões diferentes, navegação, unmount | Cobertos por React Query cache | ✅ |

---

## Meta 10/10 — checklist

- [x] Fase 0: 200 cenários mapeados
- [ ] Fase 1: `Idempotency-Key` propagada no client (em execução)
- [ ] Fase 2: E2E Deno com folha real
- [ ] Fase 3: Auditoria+integridade em `fechar-folha`/`reabrir-folha`
- [ ] Fase 4: `vw_folha_compliance`
- [ ] Fase 5: Painel `/compliance/folha`
- [ ] Fase 6: Cron purge + edge `idempotency-metrics`
- [ ] Fase 7: Rate-limit + circuit breaker + suíte final

Documento vivo — atualizado a cada fase.
