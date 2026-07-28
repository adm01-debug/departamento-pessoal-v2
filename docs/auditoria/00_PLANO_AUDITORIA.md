# Plano Mestre de Auditoria Exaustiva — Sistema Departamento Pessoal v2

> **Auditor:** Engenharia Sênior / Análise de Sistemas
> **Data de início:** 2026-07-18
> **Escopo:** 662 arquivos TS/TSX (~106k LOC), 102 páginas, ~90 services, ~66 hooks, 54 Edge Functions, 405 migrations.
> **Stack:** React 19 + TypeScript + Vite 8 + Supabase (via `external-db-bridge`) + Deno Edge Functions.
> **Objetivo desta fase:** **DESCOBRIR e DOCUMENTAR** falhas e gaps de forma exaustiva. **Nenhuma correção** é aplicada nesta fase.

Este documento define (A) a decomposição da missão global em **30 etapas de auditoria**, e (B) o **plano de execução em 50 passos**. Os achados ficam em `01_FALHAS_E_GAPS.md`; o rastreamento de testes E2E em `02_MATRIZ_TESTES_E2E.md`.

---

## A. Decomposição da Missão Global em 30 Etapas de Auditoria

Cada etapa é um domínio de auditoria independente, com fronteiras claras, entregável próprio e critério de "concluído".

| #   | Etapa                                    | Escopo principal                                                | Entregável                  |
| --- | ---------------------------------------- | --------------------------------------------------------------- | --------------------------- |
| 1   | Inventário e mapa do sistema             | Estrutura de pastas, contagem de módulos, grafo de dependências | Mapa de módulos + LOC       |
| 2   | Arquitetura de acesso a dados            | `external-db-bridge`, `client.ts` query-builder                 | Modelo de ameaça do gateway |
| 3   | Autenticação                             | `AuthContext`, sessão, refresh, gov.br, callback                | Fluxo de auth + falhas      |
| 4   | Autorização / RBAC                       | `AdminRoute`, `ProtectedRoute`, `user_roles`, gating de UI      | Matriz de rotas × guarda    |
| 5   | RLS e isolamento multi-tenant            | 405 migrations, políticas, `empresa_id`                         | Matriz tabela × RLS         |
| 6   | Segurança das Edge Functions             | 54 functions: JWT, CSRF, validação, segredos                    | Matriz function × controles |
| 7   | Criptografia e assinatura digital        | `criptografia`, `assinaturaDigital`, `integrityHash`            | Avaliação de algoritmos     |
| 8   | Núcleo de cálculo — impostos             | INSS, IRRF, FGTS, tabelas fiscais                               | Verificação numérica        |
| 9   | Núcleo de cálculo — folha                | `calcular-folha`, `folhaCalc`, lote                             | Divergências front×edge     |
| 10  | Núcleo de cálculo — rescisão             | `calcular-rescisao`, `rescisao.ts`                              | Conformidade CLT            |
| 11  | Núcleo de cálculo — férias/13º/provisões | `calcular-ferias/-13/-provisoes`                                | Conformidade + avos         |
| 12  | Ponto e jornada                          | Batidas, banco de horas, offline, biometria                     | CLT + integridade           |
| 13  | eSocial / FGTS Digital / DCTFWeb         | Layouts de evento, idempotência, ordem                          | Conformidade de layout      |
| 14  | Bancário / CNAB                          | Remessa 240/400, dígitos, centavos                              | Conformidade FEBRABAN       |
| 15  | Benefícios / descontos / consignado      | Margem consignável, descontos, adiantamento                     | Regras + net negativo       |
| 16  | Workflows de RH                          | Admissão, desligamento, afastamento, contratação                | Máquinas de estado          |
| 17  | LGPD e privacidade                       | Anonimização, consentimento, retenção                           | Irreversibilidade real      |
| 18  | Documentos / OCR / assinatura            | Geração, sanitização, integridade                               | XSS + integridade           |
| 19  | Camada de services (frontend)            | ~90 services, uso do bridge, `empresa_id`                       | Broken access control       |
| 20  | Hooks e estado React                     | ~66 hooks, efeitos, corridas, vazamentos                        | Bugs comportamentais        |
| 21  | Componentes e UI                         | 102 páginas, formulários, validação de input                    | Validação + a11y            |
| 22  | Validação e schemas                      | Zod schemas, validators, CPF/CNPJ/CEP                           | Cobertura de validação      |
| 23  | Tratamento de erros                      | catch vazios, erros suprimidos, feedback                        | Falhas silenciosas          |
| 24  | Tipagem e segurança de tipos             | `any` (382 `as any`, 913 `: any`), `as never`                   | Erosão de tipos             |
| 25  | Testes unitários/componente              | 27 arquivos, hermeticidade, qualidade                           | Cobertura + gaps            |
| 26  | Testes E2E                               | Playwright, projetos, jornadas críticas                         | Matriz de jornadas          |
| 27  | Portões de qualidade / CI                | typecheck, lint, build, husky, workflows                        | Estado real dos gates       |
| 28  | Infra / containers / IaC                 | Docker, k8s, terraform, helm, ansible                           | Hardening gaps              |
| 29  | Configuração / segredos / deps           | `.env`, `npm audit`, lockfiles, monitoring                      | Segredos + CVEs             |
| 30  | Observabilidade e resiliência            | Sentry, telemetria, idempotência, backup                        | Cobertura de sinais         |

**Critério de conclusão global:** cada etapa produz uma seção em `01_FALHAS_E_GAPS.md` com achados classificados por severidade (CRÍTICO / ALTO / MÉDIO / BAIXO), cada um com `arquivo:linha`, descrição e cenário concreto de falha.

---

## B. Plano de Execução em 50 Passos

Fases: **I. Reconhecimento (1–8)** · **II. Segurança (9–20)** · **III. Correção de Cálculo (21–28)** · **IV. Domínios de Negócio (29–36)** · **V. Qualidade & Frontend (37–43)** · **VI. Infra & CI (44–47)** · **VII. Consolidação (48–50)**.

> Legenda de estado: ✅ concluído nesta fase de descoberta · 🔄 em andamento · ⬜ pendente (fase de correção futura).

### Fase I — Reconhecimento

1. ✅ Clonar/abrir repo, mapear árvore, contar módulos e LOC.
2. ✅ Ler documentação existente (AUDIT_REPORT, CODE_REVIEW, QA reports) para evitar retrabalho e confrontar afirmações.
3. ✅ Rodar portões reais: `tsc`, `eslint`, `vitest`, `npm audit` (registrar estado factual).
4. ✅ Ler `external-db-bridge/index.ts` e `client.ts` — entender o modelo de acesso.
5. ✅ Mapear rotas (`App.tsx`) e guardas (`AdminRoute`/`ProtectedRoute`).
6. ✅ Levantar contagens de smells (`any`, `catch`, `dangerouslySetInnerHTML`, `toFixed`, stubs).
7. ✅ Verificar segredos versionados (`.env` rastreado no git; credenciais hardcoded).
8. ✅ Definir a decomposição em 30 etapas e este plano de 50 passos.

### Fase II — Segurança

9. ✅ Auditar autorização/RBAC: enforcement apenas client-side, escalonamento via `user_roles`.
10. ✅ Auditar autenticação: fallback anon do bridge, expiração de sessão, roles em memória.
11. ✅ Auditar RLS e isolamento multi-tenant nas 405 migrations. _(agente dedicado)_
12. ✅ Auditar segurança das 54 Edge Functions (JWT/CSRF/validação/segredos). _(agente dedicado)_
13. ✅ Avaliar CSRF compartilhado (`_shared/csrf.ts`) — allowlist ampla `*.lovable.app`, double-submit opcional.
14. ✅ Auditar criptografia e assinatura digital.
15. ✅ Auditar injeção via `.or()` PostgREST e passthrough do bridge.
16. ✅ Auditar biometria/ponto (validação teatral, bucket público, fila offline).
17. ⬜ Verificar dinamicamente (staging) se `EXTERNAL_DB_KEY` é `service_role` (bypass total de RLS) — **bloqueado por acesso a ambiente**.
18. ⬜ Pentest de leitura anônima do bridge contra tabelas sensíveis reais — **requer ambiente autorizado**.
19. ✅ Auditar segredos versionados e monitoring configs. _(agente dedicado)_
20. ✅ Consolidar cadeia de exploração (escalonamento → acesso cross-tenant → exfiltração).

### Fase III — Correção de Cálculo (auditoria; correção adiada)

21. ✅ Verificar tabelas fiscais 2026 (min., teto INSS, faixas).
22. ✅ Verificar INSS progressivo e teto (front + edge).
23. ✅ Verificar IRRF (dedução simplificada vs legal, dependentes) — divergência front×edge.
24. ✅ Verificar FGTS e multas (40%/20%).
25. ✅ Verificar rescisão (avos de 13º, guarda de `pedido_demissao`, tempo de serviço).
26. ✅ Verificar férias/13º/provisões (regra dos 15 dias, encargos divergentes).
27. ✅ Mapear as duas engines de folha divergentes e o contrato de integridade quebrado.
28. ✅ Documentar exemplos numéricos (valor errado vs correto) para cada achado de cálculo.

### Fase IV — Domínios de Negócio

29. ✅ Auditar ponto/jornada/banco de horas (fusos, DSR, noturno, offline). _(agente dedicado)_
30. ✅ Auditar eSocial/FGTS Digital/DCTFWeb (idempotência, ordem, layout). _(agente dedicado)_
31. ✅ Auditar CNAB/bancário (larguras de campo, dígitos, centavos). _(agente dedicado)_
32. ✅ Auditar benefícios/consignado/adiantamento (margem, net negativo). _(agente dedicado)_
33. ✅ Auditar workflows (admissão/desligamento/afastamento) — transições inválidas. _(agente dedicado)_
34. ✅ Auditar LGPD/anonimização (irreversibilidade, consentimento). _(agente dedicado)_
35. ✅ Auditar documentos/OCR/assinatura (integridade, sanitização). _(agente dedicado)_
36. ✅ Identificar features "stub"/mock apresentadas como prontas.

### Fase V — Qualidade & Frontend

37. ✅ Auditar hooks/efeitos (deps, corridas, vazamentos, pureza). _(agente dedicado)_
38. ✅ Auditar services frontend (uso do bridge, `empresa_id`, null checks). _(agente dedicado)_
39. ✅ Auditar tratamento de erros e falhas silenciosas.
40. ✅ Auditar erosão de tipos (`any`/`as never`) e regras de lint customizadas violadas.
41. ✅ Auditar cobertura e qualidade de testes unitários/componente. _(agente dedicado)_
42. ✅ Auditar cobertura E2E vs jornadas críticas. _(agente dedicado)_
43. ✅ Consolidar matriz de gaps de teste por módulo crítico.

### Fase VI — Infra & CI

44. ✅ Auditar Docker/compose (root, segredos, tags).
45. ✅ Auditar k8s (secrets em repo, limites, probes) e duplicação `.yml`/`.yaml`.
46. ✅ Auditar CI/workflows, terraform/helm/ansible, nginx headers.
47. ✅ Auditar `npm audit`, lockfiles duplicados (`package-lock.json` + `bun.lock`), monitoring.

### Fase VII — Consolidação

48. ✅ Deduplicar e classificar todos os achados por severidade e módulo.
49. ✅ Escrever `01_FALHAS_E_GAPS.md` (exaustivo) e `02_MATRIZ_TESTES_E2E.md`.
50. ✅ Sumário executivo, cadeia de risco priorizada e backlog de remediação (para fase seguinte).

---

## C. Limitações desta auditoria (transparência)

- **Sem acesso ao ambiente de execução real**: não foi possível confirmar dinamicamente se `EXTERNAL_DB_KEY` é a `service_role key` (o que causaria bypass total de RLS) nem executar as jornadas E2E contra o backend (egress de rede bloqueado no sandbox). Estes itens ficam marcados como "requer verificação em ambiente autorizado".
- **Dependências parciais no sandbox**: `exceljs` e a resolução ESM de `sonner→react` falharam no ambiente, fazendo 7 arquivos de teste não rodarem aqui (artefato de ambiente, não necessariamente defeito de código). 201 testes passam; 2 falham por egress de rede bloqueado.
- **Tabelas fiscais 2026**: os valores hardcoded correspondem às figuras de 2025; não há acesso às tabelas oficiais 2026 para confirmação (ver achado de cálculo L1).
