# Relatório de QA — Simulação e Auditoria Exaustiva

**Data:** 2026-06-14
**Escopo:** Sistema Departamento Pessoal v2 (React 19 + TypeScript + Vite + Supabase) — 674 arquivos TS/TSX, 62 páginas, 60 serviços, 62 hooks.
**Metodologia:** Execução dos portões de qualidade reais (build, typecheck, lint, testes) + auditoria de código camada por camada (cálculos, serviços/dados, UI).

---

## 1. Resumo executivo

O sistema está **funcional e saudável**. Todos os portões automáticos passam:

| Portão | Resultado |
|---|---|
| `tsc --noEmit` (typecheck) | ✅ 0 erros |
| `eslint src` | ✅ 0 erros, 80 warnings |
| `vitest run` (testes unitários) | ✅ 198/198 passando (15 arquivos) |
| `vite build` (produção) | ✅ build OK, PWA 216 entradas |

O núcleo crítico (folha, INSS, IRRF, FGTS, rescisão, férias) está **correto e coberto por testes**. Os problemas encontrados são de **higiene/manutenibilidade**, não de funcionalidade quebrada.

---

## 2. Validação do núcleo de cálculo (crown jewel)

Fonte única de verdade: `src/calculators/` + `src/utils/folhaCalc.ts`.

- **Tabelas fiscais 2026** (`src/calculators/tabelas.ts`): salário mínimo R$ 1.518,00; teto INSS R$ 8.157,41; faixas INSS (7,5%/9%/12%/14%) e IRRF progressivas; dedução simplificada R$ 564,80; dependente R$ 189,59. ✔️ Consistentes.
- **INSS** (`impostos.ts`): cálculo progressivo por faixa com teto. ✔️ Correto (comentário confirma remoção de bug anterior de faixa duplicada).
- **IRRF** (`impostos.ts`): compara base legal vs desconto simplificado e usa a menor (mais benéfica). ✔️ Correto.
- **Rescisão** (`rescisao.ts`): 13º proporcional (zerado em justa causa), férias proporcionais com **regra dos 15 dias (CLT art. 146)**, multa FGTS 40% (sem justa causa) / 20% (acordo), aviso prévio, terço constitucional, INSS/IRRF nas bases corretas e **férias indenizadas isentas**. ✔️ Conforme legislação e coberto por `rescisaoService.test`, `rescisaoCalc.test`.

---

## 3. Correções aplicadas neste PR (seguras, verificadas)

Foram removidos arquivos **comprovadamente mortos** (zero imports em todo o `src`, incluindo alias `@/`, imports dinâmicos, barrels e testes). Após a remoção, typecheck + build + 198 testes continuam verdes.

### 3.1 Camada de cálculo duplicada (shims órfãos)
- **Removido `src/utils/calculos/` inteiro (42 arquivos).** Eram re-exports de 1 linha apontando para `src/calculators/` (ex.: `export { calcularINSS as default } from '@/calculators/impostos'`). Nenhuma lógica única; nenhum import em lugar algum. Consolidação na fonte única `src/calculators/`.

### 3.2 Arquivos de configuração órfãos/duplicados
- **`tailwind.config.ts`** — órfão. O ativo é `tailwind.config.js`, referenciado por `src/index.css` via `@config "../tailwind.config.js"` (Tailwind v4).
- **`.eslintrc.app.json`** e **`.eslintrc.cjs`** — legados. O ativo é o flat config `eslint.config.js` (ESLint 10).
- **`.prettierrc.app.json`** — duplicata órfã de `.prettierrc`.

---

## 4. Achados pendentes (recomendações — não alterados neste PR)

### 4.1 Código morto remanescente — `src/utils/folha/`
Apenas `validadorFolha.ts` e `pontoIntegracaoUtils.ts` são usados. Os outros ~28 arquivos (shims/orquestrações de `@/calculators`) + o barrel `index.ts` estão sem referência. Recomenda-se consolidar mantendo só os 2 usados. *(Não removido neste PR por mesclar arquivos usados e não usados — requer revisão item a item.)*

### 4.2 Warnings de lint genuínos (80 no total; 0 erros)
Priorizados por impacto real:

- **`react-hooks/purity` (7)** — `Date.now()`/valor instável durante render:
  `WorkflowsPage.tsx:98,258` (cálculo de SLA de horas), `ContratacaoPage.tsx:259`, `LGPDPage.tsx:73,194`, `PontoClockRegister.tsx:118`, `sidebar.tsx:536`. Comportamento aceitável hoje (recalcula no render), mas o correto é mover para `useMemo`/estado com timer para estabilidade.
- **`react-hooks/set-state-in-effect` (19)** — padrão "sincronizar form com dados buscados" (com guard `!editing`). Aceitável; idealmente derivar via `key`/estado controlado para evitar render duplo.
- **`react-hooks/exhaustive-deps` (19)** — dependências de efeito ausentes; risco de closures defasadas. Revisar caso a caso (ex.: `useEmpresas.ts:149`, `useRealtimeDashboard.ts:65,67`, `AuthContext.tsx:143`).
- **`react-refresh/only-export-components` (23)** e demais — apenas DX/HMR, sem impacto em produção.

### 4.3 Inconsistência de configuração — lint-staged
Coexistem **`.lintstagedrc`** e **`.lintstagedrc.json`** com conteúdos **diferentes** (o `.json` inclui `vitest related`). Resolução ambígua. Recomenda-se manter apenas um. (O hook `.husky/pre-commit` hoje chama `npm run lint` diretamente, então a config lint-staged está vestigial.)

### 4.4 Duplicidade de lockfiles
Coexistem `bun.lock` (311 KB) e `package-lock.json` (557 KB). Padronizar um gerenciador evita drift de versões.

---

## 5.1 Continuação — execução das melhorias (rumo a 10/10)

Segunda rodada, com verificação (typecheck + build + testes) a cada passo:

- **Simulação exaustiva:** nova suíte `src/calculators/__tests__/scenarios.test.ts`
  (~45 cenários / centenas de asserções por varredura). Revelou e corrigiu
  **5 gaps de robustez**: `NaN` em INSS/IRRF, negativo/`NaN` em FGTS, e `Infinity`
  por `jornadaMensal=0` em horas extras/adic. noturno/sobreaviso/prontidão.
  Cobertura de testes: **198 → 243**.
- **Código morto:** removidos 29 shims sem uso de `src/utils/folha/`.
- **Bugs de React corrigidos:** `Date.now()` no render (novo hook `useNow`) em
  WorkflowsPage/LGPDPage; ref defasada no cleanup de `useRealtimeDashboard`;
  uso de função antes da declaração (useCallback) em Contabilidade/Financeiro/CNAB.
- **Deploy:** `package-lock.json` ressincronizado (faltava `@vitest/coverage-v8`),
  evitando quebra de `npm ci` em produção.
- **E2E:** desabilitado o tour de onboarding no setup de auth (overlay `z-[200]`
  interceptava cliques e quebrava 8 testes autenticados).

### Status dos warnings de lint
Reduzidos os bugs reais (purity de render, ref-cleanup, use-before-declare). Os
~75 warnings restantes pertencem às regras do **React Compiler**
(`set-state-in-effect`, `immutability`, `incompatible-library`,
`preserve-manual-memoization`) + `exhaustive-deps` de efeitos de mount e
`react-refresh` (apenas HMR). O próprio projeto as define como **`warn`
(adoção incremental)** em `eslint.config.js`, e o CI **não bloqueia** nelas.
Levá-las a zero exige adotar o `babel-plugin-react-compiler` (mudança
arquitetural, em esforço dedicado) — não suprimir regras nem fazer refactors
de efeito que arriscariam loops. Recomenda-se como evolução planejada.

## 5. Conclusão

Sistema **aprovado** para operação: compila, passa em 198 testes, sem erros de tipo nem de lint, e com a lógica trabalhista/fiscal correta. As ações deste PR reduzem ruído e consolidam a camada de cálculo numa **fonte única de verdade**, sem qualquer regressão (verificado). Os itens da seção 4 são melhorias incrementais recomendadas para evoluções futuras.
