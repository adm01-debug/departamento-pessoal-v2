# 📐 Plano Fase 2 — Atacar os 1077 `any` restantes

**Arquiteto:** Claude Code | **Data:** 2026-05-28
**Pré-requisito:** PR #13 (Fase 1) deve estar MERGEADO em `main` antes de começar.
**Branch base:** `main` (após merge do PR #13)
**Nova branch:** `fix/refactor-any-types-fase2-2026-05-28`

## 🎯 Meta da Fase 2

Reduzir de **1077 → menos de 400** anys (~63% redução adicional).

## 📊 Foco da Fase 2 (o que a Fase 1 deixou)

- `tabelasReferenciaService.ts` (23 as any) — **Cline pulou na Fase 1**
- Hooks: `useNovasTabelas.ts` (20), `useTabelasReferencia.ts` (11) — não tocados
- Pages top: Afastamentos (16), Treinamentos (13), EPIs (12), Documentos (11), Workflows (10), MedidasDisciplinares (10), ComunicacaoInterna (10)
- 818 parâmetros de função (foco nos arquivos mais usados)

## 🛡️ Regras (mesmas da Fase 1)

1. NUNCA mude lógica de negócio.
2. Se não souber o tipo, use `unknown` + type guard.
3. Rode `npx tsc --noEmit` após cada etapa.
4. 1 etapa = 1 commit.
5. NÃO use `any` pra escapar.

## 📋 As 5 etapas

### Etapa 1 — `tabelasReferenciaService.ts` (cauda da Fase 1)
**Escopo:** o arquivo que Cline esqueceu — 23 as any.
**O que fazer:** identificar quais tabelas de referência ele acessa (CBO, CNAE, INSS, IRRF, etc.) e tipar cada chamada com `Database['public']['Tables']['nome']['Row']`.
**Verificação:** `npx tsc --noEmit` passa.
**Commit:** `refactor(services): tipa tabelasReferenciaService (cauda Fase 1)`

### Etapa 2 — Hooks principais (useNovasTabelas + useTabelasReferencia)
**Escopo:** `src/hooks/useNovasTabelas.ts` (20 :any) + `src/hooks/useTabelasReferencia.ts` (11 :any)
**O que fazer:**
- Identificar o que esses hooks retornam (geralmente `useQuery<T>` ou `useState<T>`).
- Definir generics no hook: `useNovasTabelas<T extends keyof Database['public']['Tables']>(table: T)`.
- Trocar `any` em parâmetros por tipos genéricos.
**Verificação:** Compila + as pages que consomem ainda compilam (esses 2 hooks são usados em dezenas de lugares).
**Commit:** `refactor(hooks): tipa useNovasTabelas e useTabelasReferencia`

### Etapa 3 — Pages top 7 (Afastamentos, Treinamentos, EPIs, Documentos, Workflows, MedidasDisciplinares, ComunicacaoInterna) **[PUSH AQUI]**
**Escopo:** 7 pages com ~80 `:any` totais.
**O que fazer:**
- Trocar `useState<any>(...)` por `useState<TipoCorreto | null>(null)` (inferir do uso).
- Trocar handlers `(e: any) =>` por `(e: React.ChangeEvent<HTMLInputElement>)` etc.
- Trocar props de subcomponentes que aceitam `any`.
**Verificação:** Compila + rodar `bun dev` se possível, ou pelo menos validar via tsc.
**Commit:** `refactor(pages): tipa pages top 7 (Afastamentos, Treinamentos, EPIs, etc.)`
**🔼 Após esta etapa: `git push -u origin fix/refactor-any-types-fase2-2026-05-28`**

### Etapa 4 — Limpeza de `useState<any>`, `any[]` e generics
**Escopo:** ataque dirigido aos padrões mais fáceis:
- 39 `useState<any>` → `useState<unknown>` ou tipo concreto inferido do uso
- 58 `any[]` → `unknown[]` ou tipo concreto
- 146 `<any>` em generics (Map, Set, Promise, etc.) → `<unknown>` ou tipo concreto
**O que fazer:** comando bulk `grep + Edit` em cada padrão. Se algum quebrar o tsc, tipar manualmente.
**Verificação:** `npx tsc --noEmit` passa, build passa.
**Commit:** `refactor: substitui useState<any>, any[] e generics <any>`

### Etapa 5 — Cleanup final + PR **[PUSH FINAL + PR]**
**Escopo:** o que sobrou.
**O que fazer:**
1. Rodar `grep -rEn "\b: any\b|as any" src --include="*.ts" --include="*.tsx" | wc -l` — comparar com 1077 inicial.
2. Atacar os top 5 arquivos restantes (provavelmente alguns services menores).
3. Rodar testes: `bun test` ou `npm test`.
4. Rodar build: `bun run build`.
5. Atualizar `CODE_REVIEW.md` ou criar `REFATORACAO_TIPOS_FASE2.md` com estatísticas finais.
6. **Mergear `fix/refactor-any-types-fase2-2026-05-28` na main após review** (não fazer auto-merge).
**Verificação:**
- Build passa
- Testes passam
- Total any < 400
**Commit:** `refactor: cleanup final Fase 2`
**Push final:** `git push`
**Abrir PR:**
```
gh pr create \
  --title "refactor: Fase 2 — elimina cauda dos any (1077 → <400)" \
  --body "Continuação da Fase 1 (PR #13).

Antes (após Fase 1): 1077 anys.
Depois: <preencher>

5 etapas focadas no que a Fase 1 deixou: tabelasReferenciaService, hooks principais, pages top 7, useState<any>, generics, any[].

Build e testes passando.

Plano completo em PLANO_REFATORACAO_TIPOS_FASE2.md."
```

## 📊 Relato final via bridge

Após etapa 5, mandar bridge_send:
```
Cline: Fase 2 concluída. PR: <URL>.
Antes/depois: 1077 → X
Redução adicional: Y%
Etapas: 5/5
Build: passing
Testes: passing
```

## ⚠️ Quando parar e pedir ajuda

- Se uma etapa exigir mudar lógica de negócio: PARE, mande bridge_send.
- Se mais de 50 erros de TS após uma etapa: PARE, mande bridge_send (escolheu tipo errado).
- Se travar 3x na mesma etapa: PARE, mande bridge_send.

Boa Fase 2!
