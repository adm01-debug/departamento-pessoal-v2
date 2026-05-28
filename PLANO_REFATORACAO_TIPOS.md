# 📐 Plano de Refatoração: Eliminar `any` em TypeScript

**Arquiteto:** Claude Code
**Executor:** Cline (DeepSeek v4-pro)
**Data:** 2026-05-28
**Repositório:** `adm01-debug/departamento-pessoal-v2`

---

## 🎯 Objetivo

Reduzir drasticamente o uso de `any` no código TypeScript (atualmente **1515 instâncias**: 932 anotações `: any` + 583 casts `as any`), restaurando a verificação de tipos do TS em pontos críticos onde bugs podem se esconder.

## 📊 Diagnóstico inicial

- **`strict: true`** já está ligado no tsconfig — os `any` são EXPLÍCITOS, foram escritos à mão (não inferidos)
- **842 `any` em parâmetros de função** — categoria mais perigosa (entrada de dados sem validação de tipo)
- **583 `as any`** concentrados em services (camada de dados) — escondem incompatibilidade entre Supabase responses e tipos esperados
- **147 `<any>` em genéricos** — tipicamente em `useState<any>`, `useQuery<any>`, etc.
- **TOP 5 arquivos mais "envenenados":**
  1. `src/services/colaboradorDetalhesService.ts` (37 as any)
  2. `src/services/cnabService.ts` (30 as any)
  3. `src/integrations/supabase/client.ts` (27 : any)
  4. `src/services/tabelasReferenciaService.ts` (24 as any)
  5. `src/hooks/useNovasTabelas.ts` (23 : any)

## 🛡️ Regras de ouro

Para CADA etapa abaixo:
1. ✅ **NUNCA** apague código de negócio. Só troque `any` por tipo correto, ou crie tipo novo.
2. ✅ Se não souber o tipo certo, use `unknown` + type guard (NÃO use `any`).
3. ✅ Se o tipo vier do Supabase, busque em `src/integrations/supabase/types.ts` ou use `Database['public']['Tables']['nome']['Row']`.
4. ✅ Para callbacks/eventos de DOM, use tipos do React (`React.ChangeEvent<HTMLInputElement>`, etc.).
5. ✅ Rode `bun run typecheck` (ou `npx tsc --noEmit`) ao final de cada etapa. Se quebrar, AJUSTE — não regrida pra `any`.
6. ✅ Rode os testes existentes se a etapa mexer em arquivos testados: `bun test` ou `npm test`.
7. ✅ 1 etapa = 1 commit. Mensagem clara em português.
8. ✅ Não mude lógica de negócio. Apenas tipagem.
9. ✅ Use `git stash` se precisar trocar de contexto entre etapas.

## 🗂️ Estrutura de execução

- **Branch única:** `fix/refactor-any-types-2026-05-28`
- **20 commits sequenciais** na mesma branch
- **1 PR no final** com sumário dos achados
- Push incremental a cada 5 etapas (etapas 5, 10, 15, 20)

---

## 📋 As 20 etapas

### FASE 1 — Fundação (Etapas 1-3)

#### Etapa 1 — Tipos auxiliares centrais
**Escopo:** criar/expandir `src/types/`
**O que fazer:**
- Verificar se `src/types/` já tem tipos para: `Colaborador`, `Empresa`, `Funcionario`, `Departamento`, `Cargo`, `Endereco`, `Dependente`, `Periodo` (com `dataInicio`, `dataFim`).
- Se não tiver, criar `src/types/entities.ts` com esses tipos, usando os campos das tabelas Supabase como base.
- Criar `src/types/api.ts` com `ApiResponse<T>`, `ApiError`, `PaginatedResponse<T>` se ainda não existirem.
**Verificação:** `npx tsc --noEmit` passa.
**Commit:** `refactor(types): cria tipos auxiliares para entidades de RH`

#### Etapa 2 — Tipar o Supabase Client/Bridge
**Escopo:** `src/integrations/supabase/client.ts` (27 `: any`)
**O que fazer:**
- Definir interface `SupabaseProxyClient` com os métodos da bridge externa (`select`, `insert`, `update`, `delete`, `rpc`).
- Trocar todos os parâmetros `any` por tipos genéricos `<T extends keyof Database['public']['Tables']>`.
- Manter funcionamento idêntico — só adicionar tipos.
**Verificação:** Compila, app continua rodando, logins funcionam.
**Commit:** `refactor(supabase): tipa proxy bridge do Supabase client`

#### Etapa 3 — Atualizar tipos gerados do Supabase
**Escopo:** `src/integrations/supabase/types.ts`
**O que fazer:**
- Verificar se o arquivo está atualizado com o schema atual do banco.
- Se possível, regenerar via `supabase gen types typescript --project-id hncgwjbzdajfdztqgefe > src/integrations/supabase/types.ts` (mas SEM commitar a chave! Verificar variável de ambiente).
- Se não tiver CLI, apenas validar manualmente que as tabelas usadas pelos services existem nos tipos.
**Verificação:** `npx tsc --noEmit` continua passando.
**Commit:** `refactor(supabase): atualiza tipos gerados do Database`

### FASE 2 — Camada de Services (Etapas 4-12)

#### Etapa 4 — colaboradorDetalhesService (37 as any)
**Escopo:** `src/services/colaboradorDetalhesService.ts`
**O que fazer:** trocar `as any` por tipos reais da tabela `colaboradores` e relacionadas. Criar tipos `ColaboradorDetalhado`, `ColaboradorPayload` se necessário.
**Verificação:** Compila + testes de `colaboradorDetalhesService.test.ts` (se existir) passam.
**Commit:** `refactor(services): tipa colaboradorDetalhesService`

#### Etapa 5 — cnabService (30 as any) **[PUSH AQUI]**
**Escopo:** `src/services/cnabService.ts`
**O que fazer:** CNAB é formato bancário (240/400). Criar interfaces `CnabHeaderArquivo`, `CnabHeaderLote`, `CnabDetalhe`, `CnabTrailer`. Usar literal types pra códigos de banco/operação.
**Verificação:** Compila. Se houver teste de geração de CNAB, rodar.
**Commit:** `refactor(services): tipa estruturas CNAB`
**🔼 Após esta etapa: `git push -u origin fix/refactor-any-types-2026-05-28`**

#### Etapa 6 — tabelasReferenciaService (24 as any)
**Escopo:** `src/services/tabelasReferenciaService.ts`
**O que fazer:** identificar quais tabelas de referência o service usa (CBO, CNAE, INSS, IRRF, etc.) e tipar cada uma com base no schema Supabase.
**Verificação:** Compila + testes relacionados.
**Commit:** `refactor(services): tipa tabelasReferenciaService`

#### Etapa 7 — services/tabelas/{rh,views,documentos,admin}
**Escopo:** `src/services/tabelas/rhService.ts` (20), `viewsService.ts` (16), `documentosService.ts` (10), `adminService.ts` (10) = ~56 as any
**O que fazer:** mesma estratégia da etapa 6, mas para esses 4 arquivos. Eles provavelmente compartilham padrões — extrair tipos comuns pra `src/services/tabelas/types.ts`.
**Verificação:** Compila.
**Commit:** `refactor(services/tabelas): tipa rh, views, documentos e admin services`

#### Etapa 8 — feriasService + folha/calculoLoteService
**Escopo:** `src/services/feriasService.ts` (16 as any) + `src/services/folha/calculoLoteService.ts` (10 as any)
**O que fazer:** tipar payloads de cálculo de férias e folha em lote. Pode envolver criar tipo `CalculoFeriasResult`, `LoteFolhaPayload`, etc.
**Verificação:** Compila + testes de cálculo (`calculoBeneficiosService.test.ts` por afinidade).
**Commit:** `refactor(services): tipa feriasService e calculoLoteService`

#### Etapa 9 — afastamentoService + rescisaoService
**Escopo:** `src/services/afastamentoService.ts` (8+9) + `src/services/rescisaoService.ts` (7+8)
**O que fazer:** tipar payloads de afastamento (atestado, INSS, licença) e rescisão (TRCT, verbas rescisórias).
**Verificação:** Compila + testes.
**Commit:** `refactor(services): tipa afastamento e rescisao services`

#### Etapa 10 — Demais services principais **[PUSH AQUI]**
**Escopo:** `episService.ts` (9), `calculoBeneficiosService.ts` (9), `recrutamentoService.ts` (9), `securityService.ts` (8), `beneficioService.ts` (7), `catalogoCursoService.ts` (7), `folhaPagamentoService.ts` (7), `batidasPontoService.ts` (8), `integracaoService.ts` (7)
**O que fazer:** tipar cada um focando nos `as any` mais óbvios.
**Verificação:** Compila + testes.
**Commit:** `refactor(services): tipa demais services principais`
**🔼 Após esta etapa: `git push`**

#### Etapa 11 — Services restantes
**Escopo:** todos os services em `src/services/` que ainda têm `any` (limpeza de cauda)
**O que fazer:** sweep final dos services. Listar com `grep -rn "any" src/services/ | grep -v test`, atacar arquivos restantes um por um.
**Verificação:** Compila + `grep -c "as any" src/services/*.ts` deve cair drasticamente.
**Commit:** `refactor(services): cleanup final de any em services`

#### Etapa 12 — Tipar services/__tests__
**Escopo:** `src/services/__tests__/*.test.ts` (8 anys ali)
**O que fazer:** trocar `any` por tipos reais ou usar `vi.fn<TypedFn>()`. Testes não devem usar any pra mock — usar `Mock` do Vitest com tipo.
**Verificação:** `bun test` passa.
**Commit:** `refactor(tests): tipa mocks em testes de services`

### FASE 3 — Hooks (Etapas 13-14)

#### Etapa 13 — useNovasTabelas + useTabelasReferencia
**Escopo:** `src/hooks/useNovasTabelas.ts` (23 : any) + `src/hooks/useTabelasReferencia.ts` (11 : any)
**O que fazer:** definir generics para `useQuery<T>` e tipar parâmetros. Esses dois hooks são usados em várias pages, então cuidado — testar app após mudança.
**Verificação:** Compila + as pages que consomem ainda renderizam (rodar `bun dev` e abrir tela manualmente — se Cline puder).
**Commit:** `refactor(hooks): tipa useNovasTabelas e useTabelasReferencia`

#### Etapa 14 — Demais hooks
**Escopo:** todos os outros hooks em `src/hooks/` com any
**O que fazer:** `grep -rn "any" src/hooks/` e atacar os top 10.
**Verificação:** Compila.
**Commit:** `refactor(hooks): tipa hooks restantes`

### FASE 4 — Pages (Etapas 15-16)

#### Etapa 15 — Pages top: Afastamentos, Treinamentos, EPIs, Documentos **[PUSH AQUI]**
**Escopo:** `AfastamentosPage.tsx` (16), `TreinamentosPage.tsx` (13), `EPIsPage.tsx` (12), `DocumentosPage.tsx` (11)
**O que fazer:** tipar handlers de form, estados `useState`, props de subcomponentes. Cuidado especial com `useState<any>` virar `useState<TipoCorreto | null>`.
**Verificação:** Compila + renderiza.
**Commit:** `refactor(pages): tipa pages top (Afastamentos, Treinamentos, EPIs, Documentos)`
**🔼 Após esta etapa: `git push`**

#### Etapa 16 — Pages restantes
**Escopo:** WorkflowsPage (10), MedidasDisciplinaresPage (10), ComunicacaoInternaPage (10), RecrutamentoPage (9), FaltasPage (9), DescontosPage (8), AdmissoesPage (8)
**O que fazer:** mesma estratégia da etapa 15.
**Verificação:** Compila.
**Commit:** `refactor(pages): tipa pages restantes`

### FASE 5 — Components (Etapas 17-19)

#### Etapa 17 — components/ponto + components/settings
**Escopo:** `src/components/ponto/` (34 : any) + `src/components/settings/` (29 : any)
**O que fazer:** tipar componentes de registro de ponto e configurações. Cuidado com `RegistroPonto`, `BatidaPonto`, configs do sistema.
**Verificação:** Compila + tela de ponto renderiza.
**Commit:** `refactor(components): tipa components de ponto e settings`

#### Etapa 18 — components/esocial + ferias + colaborador-detalhes
**Escopo:** `src/components/esocial/` (20), `src/components/ferias/` (18), `src/components/colaborador-detalhes/` (17)
**O que fazer:** eSocial é complexo (XML, eventos S-1000, S-2200, etc.) — usar tipos do schema oficial se houver. Férias e colaborador-detalhes são domínio próprio.
**Verificação:** Compila + telas renderizam.
**Commit:** `refactor(components): tipa components de esocial, ferias e colaborador-detalhes`

#### Etapa 19 — components: portal + folha + desligamentos + dashboard
**Escopo:** `src/components/portal/` (16), `src/components/folha/` (16), `src/components/desligamentos/` (14), `src/components/dashboard/` (14)
**O que fazer:** atacar 60 anys nessas 4 áreas. Folha de pagamento é crítica — atenção.
**Verificação:** Compila + telas críticas renderizam.
**Commit:** `refactor(components): tipa components de portal, folha, desligamentos e dashboard`

### FASE 6 — Finalização (Etapa 20)

#### Etapa 20 — Cleanup final + verificação + PR **[PUSH FINAL + PR]**
**Escopo:** tudo que sobrou
**O que fazer:**
1. Rodar `npx tsc --noEmit` e contar erros restantes.
2. Rodar `grep -rEn "\b: any\b" src --include="*.ts" --include="*.tsx" | wc -l` — comparar com 932 inicial.
3. Rodar `grep -rEn "as any" src --include="*.ts" --include="*.tsx" | wc -l` — comparar com 583 inicial.
4. Se houver components/utils restantes com any, atacar os top 5.
5. Rodar suíte completa de testes: `bun test`.
6. Rodar build: `bun run build` para garantir.
7. Atualizar `CODE_REVIEW.md` com seção "Refatoração de tipos" e estatísticas finais.
**Verificação:**
- Build passa
- Testes passam
- Total de `any` < 300 (vs 1515 inicial)
**Commit:** `refactor: cleanup final + verificação de tipos`
**Push final:** `git push`
**Abrir PR:**
```
gh pr create \
  --title "refactor: elimina uso massivo de any em TypeScript (20 etapas)" \
  --body "Refatoração completa de tipagem.

Antes: 1515 anys (932 :any + 583 as any)
Depois: <preencher>

20 commits, organizados por camada (services → hooks → pages → components).

Cada etapa preserva comportamento (apenas tipagem).
Build e testes passando.

Detalhes no PLANO_REFATORACAO_TIPOS.md (mantido no repo) e CODE_REVIEW.md."
```

---

## 📊 Relato final ao Claude (via bridge)

Após etapa 20, mandar via `bridge_send`:
```
Cline: Refatoração concluída. PR: <URL>.

Estatísticas:
- :any antes/depois: 932 → X
- as any antes/depois: 583 → Y
- Total reduzido: Z%
- Etapas com 100%: A
- Etapas com pendência: B (justificativas no PR)
- Build: passing
- Testes: X/Y passando
```

## ⚠️ Quando parar e pedir ajuda

Mande `bridge_send` ao Claude (em vez de prosseguir cegamente) se:
1. Uma etapa exige mudar lógica de negócio (não apenas tipagem)
2. Um tipo do Supabase está faltando e você não tem como gerar
3. Mais de 30 erros de TS aparecem após uma única etapa (indica que escolheu tipo errado)
4. Travar 3x na mesma etapa após tentativas diferentes

Boa refatoração!
