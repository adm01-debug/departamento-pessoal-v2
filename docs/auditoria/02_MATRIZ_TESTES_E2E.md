# Matriz de Testes E2E e Cobertura Automatizada

> **Data:** 2026-07-18. **Objetivo desta fase:** *documentar* o estado real da bateria de testes e os gaps por jornada crítica. A execução E2E completa exige backend real + browsers Playwright (não disponíveis neste sandbox — ver limitações).

## 1. Inventário de testes

| Tipo | Local | Quantidade |
|---|---|---|
| Unit/component (Vitest) | `src/**/__tests__`, `src/tests/`, `*.test.ts(x)` | 27 arquivos / 203 testes |
| Edge functions (Deno) | `supabase/functions/**/*test*.ts` | 13 arquivos (8 de 54 funções) |
| DB (Deno) | `supabase/tests/` | 2 arquivos |
| E2E (Playwright) | `e2e/**/*.spec.ts` | 20 specs |
| Setup de auth E2E | `e2e/*.setup.ts` | 2 (admin + não-admin) |

- **0/66 hooks** têm teste. **8/54 edge functions** têm algum teste (só Deno, **não** rodam no pipeline `ci:verify`).
- `test` **não** faz parte de `ci:verify` (só typecheck+lint+format). Sem threshold de cobertura.

## 2. Resultado da execução unitária (sandbox)

`vitest run` → **201 passam · 2 falham · 7 arquivos não carregam**. As 2 falhas (`rpc-permissions.test.ts`) e a não-execução de 6 suítes são **artefatos de ambiente** (egress bloqueado; `exceljs`/`sonner→react` não resolvem no sandbox), não defeitos de lógica. A suíte mais forte é `src/calculators/__tests__/scenarios.test.ts` (45 testes com valores de referência legais).

## 3. Matriz: jornada crítica × cobertura E2E

| Jornada crítica | Coberta? | Realidade |
|---|---|---|
| Login (e-mail/senha) | ✅ | `public/login.spec.ts` + `auth.setup.ts` (login real, persiste `storageState`). |
| **Login via gov.br** | ❌ | Só senha. Fluxo OAuth `auth-gov-br` sem teste unit nem E2E. |
| **Rodar folha (calcular)** | ❌ | Nenhum spec dirige o cálculo. `modulos-criticos.spec.ts` só verifica se `/folha` renderiza. |
| **Fechar folha** | ❌ | Sem E2E; só teste de service mockado. |
| **Rescisão (com resultado)** | ⚠️ fraca | `calculadora-rescisao.spec.ts` = "renderiza e aceita inputs"; sem asserção de valor. |
| **Batida com geolocalização/biometria** | ❌ | `mobile/ponto.spec.ts` só checa carregamento e botão visível; nenhuma batida submetida. |
| RBAC / proteção de rota | ✅ (decente) | Redirect anônimo + não-admin, API 401/403, RLS-no-leak. |
| Reset de senha | ✅ | Mailbox real (Mailosaur). |
| Expiração de sessão / token corrompido | ✅ | `session-expiration.spec.ts`. |
| AFDT/AEJ, dashboard, importação | ⚠️ smoke | Diálogos/KPIs visíveis; download de template `.xlsx`. |

**Dependência de backend:** E2E exige app rodando (`bun run dev` :8080) + Supabase real + credenciais semeadas. **Sem camada de mock.** Browsers Playwright não instalados aqui; egress ao Supabase bloqueado.

## 4. Matriz: módulo crítico × cobertura unitária

| Módulo | Testado? | Gap principal |
|---|---|---|
| INSS/IRRF/FGTS | ✅ | melhor coberto (`scenarios` + `rescisaoCalc`). |
| Folha (cálculo) | ⚠️ parcial | `calculoLoteService` (lote) e `folha/provisoesService` sem teste. |
| Rescisão | ⚠️ parcial | edge `calcular-rescisao` sem teste (onde estão os bugs K2–K4). |
| Férias / 13º / provisões | ⚠️ fraca | services e edges sem teste. |
| Ponto / banco de horas | ⚠️ parcial | 8 services de ponto sem teste; `parse-afdt` sem teste. |
| eSocial | ❌ | `esocialService`/`enviar-esocial` sem teste. |
| CNAB / PIX | ❌ | `cnabService`, `cnab-remessa`, `pix-lote` sem teste (geração de arquivo financeiro). |
| Benefícios | ⚠️ parcial | `beneficioService` sem teste. |
| LGPD / anonimização | ❌ | `lgpdService` sem teste. |
| external-db-bridge | ❌ | só script manual que bate em produção. |
| Auth / RBAC | ⚠️ parcial | `authService`, gov.br, `controleAcessoService` sem teste. |

## 5. Achados de qualidade de teste

| Sev | Arquivo | Problema |
|---|---|---|
| 🟠 | `src/tests/rls-logic.test.ts` | Testa uma **reimplementação** inline das políticas, não o sistema. Sempre verde; falsa segurança sobre o controle mais crítico. |
| 🟠 | `src/tests/rpc-permissions.test.ts` | "Unitário" que faz **rede real**; não-hermético, quebra em CI offline. |
| 🟡 | `src/tests/validateBridgeContract.ts` | Script com **URL+JWT hardcoded** que bate em produção; fora do glob do Vitest. |
| 🟡 | `ci:verify` | Não roda `test`; sem piso de cobertura → nada garante a suíte verde. |
| 🟡 | vários services | Over-mock (cliente inteiro stubado) sem camada de integração → drift de schema não é pego. |
| 🔵 | specs E2E de auth-error | `test.skip(!ANON_KEY)` → CI mal configurado reporta verde sem rodar. |

## 6. Top 15 comportamentos de maior risco NÃO testados (ranqueado)

1. Geração/transmissão de eventos eSocial (obrigação legal; zero testes).
2. Geração de arquivo CNAB/PIX-lote (movimenta dinheiro; zero testes).
3. Isolamento multi-tenant (RLS) — único "teste" é reimplementação falsa.
4. `external-db-bridge` (proxy genérico; só script que bate em prod).
5. Apagamento/anonimização LGPD (compliance; zero testes).
6. Concorrência de fechar/reabrir folha (lock otimista) no edge real.
7. Autenticação gov.br.
8. Guias FGTS-Digital/DCTFWeb.
9. Integridade de batida ponto ponta-a-ponta (geo/biometria/offline).
10. Acúmulo/liquidação de banco de horas ao longo do tempo.
11. Geração/assinatura/distribuição de holerite.
12. Cálculo de folha em lote (todos os colaboradores).
13. Workflow de férias (períodos, abono, 1/3).
14. Enforcement de RBAC server-side por papel nas 54 edge functions.
15. Criptografia / restauração de backup.

## 7. Plano de bateria E2E proposto (para fase de execução)

Quando houver ambiente autorizado (backend de staging + `npx playwright install`), executar por projeto:

1. **`public`** — login, reset de senha, erros de auth, callbacks, rota protegida (anônimo → /login).
2. **`authenticated` (admin)** — CRUD colaborador/empresa; **rodar folha → fechar folha → reabrir** com asserção de totais; rescisão com asserção de verbas; férias com validação CLT; geração de guias; CNAB/PIX (contra sandbox bancário).
3. **`authenticated-non-admin`** — matriz RBAC: negar `/backup`, `/lgpd`, `/auditoria`, `/usuarios`, `/seguranca`; tentar escalonamento via `user_roles` (deve falhar server-side).
4. **`mobile-smoke`** — batida com geolocalização + biometria real; fila offline (perda de batida — cobre N7); interjornada.
5. **Segurança (nova suíte)** — provar que o bridge nega leitura anônima de `colaboradores`/`folhas`/`entity_situ`/`admissao_tokens`; que UPDATE/DELETE exigem filtro `eq` efetivo (cobre B1/B2); que funções service-role exigem auth (cobre E1–E7).
