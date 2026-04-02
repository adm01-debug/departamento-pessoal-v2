# 🔍 ANÁLISE EXAUSTIVA - FUNCIONALIDADES SUGERIDAS MAS NÃO IMPLEMENTADAS

**Data da Análise:** 02/04/2026  
**Total de Páginas:** 78 | **Rotas Registradas:** 75  
**Páginas com BD Real:** ~39 | **Páginas sem BD / Mock:** ~36

---

## 🔴 CATEGORIA 1: PÁGINAS 100% MOCK / SEM BANCO DE DADOS

Estas páginas existem na UI mas usam dados fictícios hardcoded — **não persistem nada**:

| # | Página | Arquivo | Problema |
|---|--------|---------|----------|
| 1 | **Assinaturas Digitais** | `AssinaturasPage.tsx` | `MOCK_DOCS` hardcoded. Sem CRUD real, sem integração com DocuSign/API de assinatura |
| 2 | **Backup** | `BackupPage.tsx` | `setTimeout` simulado. Nenhum backup real é feito — apenas animação fake |
| 3 | **Calculadora Rescisão** | `CalculadoraRescisaoPage.tsx` | Cálculo local apenas. Não salva histórico no BD |
| 4 | **Obrigações Fiscais** | `ObrigacoesFiscaisPage.tsx` | Guias FGTS/INSS/DARF sem persistência. Dados estáticos |
| 5 | **Rubricas** | `RubricasPage.tsx` | Tabela `rubricas` pode não existir no BD. Verificar schema |
| 6 | **SST** | `SSTPage.tsx` | Matriz de risco e programas sem tabelas no BD |
| 7 | **LGPD** | `LGPDPage.tsx` | Mapeamento de dados e checklist sem persistência |

---

## 🟠 CATEGORIA 2: PÁGINAS COM INTEGRAÇÃO PARCIAL (Funcionalidade Incompleta)

| # | Página | O que funciona | O que FALTA |
|---|--------|---------------|-------------|
| 8 | **Admissões** | Usa hooks `useAdmissoes` | ❌ Sem envio automático de e-mail ao candidato, sem geração de contrato PDF na admissão |
| 9 | **eSocial** | Listagem de eventos | ❌ Sem envio real de XML ao governo, sem validação S-1000 a S-8299, sem assinatura digital |
| 10 | **Folha de Pagamento** | Cálculo básico | ❌ Sem cálculo de INSS/IRRF/FGTS real com tabelas 2026, sem integração bancária para pagamento |
| 11 | **Ponto** | Registro de batidas | ❌ Sem biometria, sem reconhecimento facial, sem geolocalização precisa validada |
| 12 | **Relatórios** | Página existe | ❌ Sem exportação real para Excel/PDF dos relatórios gerenciais |
| 13 | **Workflows** | Pipeline visual | ❌ Sem engine de execução automática (triggers, notificações por e-mail ao aprovar) |
| 14 | **Comunicação Interna** | UI de envio | ❌ Sem notificações push/e-mail reais, sem leitura confirmada |
| 15 | **Integração Bitrix24** | Tabelas de config existem | ❌ Sem sync real — edge function não implementada |
| 16 | **Holerites** | Página existe | ❌ Sem geração de PDF de holerite baseado na folha calculada |
| 17 | **Portal do Colaborador** | UI autoatendimento | ❌ Sem upload real de documentos pelo colaborador, sem vínculo auth |

---

## 🟡 CATEGORIA 3: FUNCIONALIDADES MENCIONADAS EM DOCS/ROADMAP MAS SEM PÁGINA OU CÓDIGO

Referenciadas no `PLANO_MELHORIAS_V17.md`, `ROADMAP.md` ou memória do projeto mas **nunca implementadas**:

| # | Funcionalidade | Onde é referenciada | Status |
|---|---------------|-------------------|--------|
| 18 | **Integração Bancária** (Bradesco, Itaú, BB, Santander) | V17-225 a V17-228 | ❌ Nenhum código existe |
| 19 | **FGTS Digital** - API Caixa | V17-222 | ❌ Apenas menção |
| 20 | **Conectividade Social** - SEFIP/GFIP | V17-223 | ❌ Nenhuma implementação |
| 21 | **Gov.br OAuth 2.0** | V17-224 | ❌ Nenhuma implementação |
| 22 | **WhatsApp Business API** | V17-229 | ❌ Nenhuma implementação |
| 23 | **Firebase Cloud Messaging** (Push) | V17-230 | ❌ Nenhuma implementação |
| 24 | **Two-Factor Auth (2FA)** completo | V17-169 | ⚠️ MFA parcial (TOTP setup existe, mas sem enforcement) |
| 25 | **CSRF Protection** | V17-166 | ❌ Não implementado |
| 26 | **Content Security Policy (CSP)** | V17-167 | ❌ Não implementado |
| 27 | **Audit Log para operações sensíveis** | V17-168 | ⚠️ Tabela existe, mas muitas operações não logam |
| 28 | **Web Workers para cálculos pesados** | V17-237 | ❌ Nenhum worker existe |
| 29 | **IndexedDB para cache local** | V17-238 | ❌ Não implementado |
| 30 | **PWA / Service Worker** | V17-239 a V17-245 | ❌ Sem manifest.json, sem SW, sem offline |
| 31 | **Background Sync** | V17-244 | ❌ Não implementado |
| 32 | **Virtualização de listas** | V17-236 | ❌ Listas longas sem virtualização |
| 33 | **Integração contábil** | Memória do projeto | ❌ Nenhum código |
| 34 | **Fluxos onboarding automatizados** | Memória competitiva | ⚠️ OnboardingPage existe mas sem automação real (triggers/e-mails) |

---

## 🔵 CATEGORIA 4: SERVICES SEM IMPLEMENTAÇÃO REAL

Serviços que existem mas retornam dados mock ou não cobrem funcionalidade completa:

| # | Service | Situação |
|---|---------|----------|
| 35 | `esocialService.ts` | Gera eventos locais, **não envia XML ao governo** |
| 36 | `webhookService.ts` | Configuração existe, **sem disparo real de webhooks** |
| 37 | `comunicacaoService.ts` | CRUD local, **sem envio de e-mail/SMS/push** |
| 38 | `notificacoesService.ts` | Salva no BD, **sem push notification real** |
| 39 | `lgpdService.ts` | Estrutura básica, **sem DSAR automation** |
| 40 | `workflowService.ts` | Pipeline visual, **sem engine de execução** |

---

## 🟣 CATEGORIA 5: TABELAS NO BD SEM USO NA APLICAÇÃO

Tabelas existentes no schema que **não são utilizadas por nenhuma página**:

| # | Tabela | Descrição | Usada? |
|---|--------|-----------|--------|
| 41 | `query_telemetry` | Telemetria de queries | ⚠️ Apenas pela edge function |
| 42 | `bitrix24_config` | Config do Bitrix | ❌ Nenhuma UI de sync |
| 43 | `bitrix24_sync_logs` | Logs de sync | ❌ Não exibido |
| 44 | `blocked_ips` | IPs bloqueados | ❌ Sem UI de gestão |
| 45 | `campos_customizados` | Campos custom por empresa | ❌ Sem UI para criar/editar |
| 46 | `candidatos` / `candidaturas` | Recrutamento | ⚠️ RecrutamentoPage existe mas usa hooks, verificar se CRUD completo |

---

## 📊 RESUMO QUANTITATIVO

| Categoria | Qtd | Impacto |
|-----------|-----|---------|
| Páginas 100% Mock | 7 | 🔴 Crítico — usuário pensa que funciona |
| Integração parcial | 10 | 🟠 Alto — funciona pela metade |
| Mencionado sem código | 17 | 🟡 Médio — promessa não cumprida |
| Services incompletos | 6 | 🔵 Alto — backend não funciona |
| Tabelas sem uso | 6 | 🟣 Baixo — desperdício de schema |
| **TOTAL** | **46** | — |

---

## 🎯 PRIORIZAÇÃO SUGERIDA (Top 10 para implementar AGORA)

1. **Assinaturas → BD real** — tabela existe (`admissao_tokens`), só precisa conectar
2. **Backup → exportação real** — dump de tabelas para CSV/JSON
3. **Folha → cálculos reais** — INSS/IRRF com tabelas 2026
4. **eSocial → validação XML** — pelo menos validar antes de "enviar"
5. **Holerites → PDF real** — gerar a partir dos dados da folha calculada
6. **Portal → upload documentos** — storage bucket já configurável
7. **Workflows → notificações** — edge function para enviar e-mail ao aprovar
8. **Campos customizados → UI** — tabela existe, só falta interface
9. **IPs bloqueados → UI admin** — tabela existe, só falta painel
10. **Bitrix24 sync → edge function** — config existe, falta a execução

---

*Análise gerada em 02/04/2026 por inspeção direta do código-fonte*
