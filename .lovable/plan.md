
## Análise Exaustiva do Sistema — Plano

O usuário pede um levantamento completo de todas as funcionalidades do sistema (Lovable + GitHub). Isto é uma tarefa de **pesquisa/auditoria**, não implementação. Vou explorar exaustivamente o repositório e entregar um relatório detalhado.

### Escopo da análise

1. **Frontend (75+ páginas)** — listar todas rotas, módulos, componentes principais
2. **Backend (195 tabelas, 17 views, 20 DB functions, 34 edge functions)** — mapear cada uma
3. **Hooks customizados (272)** — agrupar por domínio
4. **Serviços (121+)** — categorizar por área de negócio
5. **Calculadoras trabalhistas (18)** — INSS, IRRF, FGTS, férias, 13º, rescisão, etc.
6. **Validadores eSocial (35 eventos)** — S-1000 a S-8299
7. **Integrações (55 pastas)** — bancos, ERPs, ponto, benefícios
8. **Segurança (42 módulos)** — MFA, SSO, criptografia, RLS
9. **IA/ML (28 módulos)** — predição, análise, automação
10. **Mobile/PWA, A11y, Performance, DevOps, Storybook, Testes**

### Etapas de exploração

1. Ler `src/App.tsx` completo → mapear todas as rotas
2. Listar `src/pages/` → confirmar páginas
3. Listar `src/components/` por subdomínio
4. Listar `src/hooks/`, `src/services/`, `src/calculators/`
5. Listar `supabase/functions/` → todas edge functions
6. Listar `supabase/migrations/` → contagem
7. Consultar tabelas BD via `supabase--read_query` (information_schema)
8. Ler docs principais: `AUDITORIA_V7_COMPLETA.md`, `ANALISE_BACKEND_VS_FRONTEND.md`, `PLANO_MASTER_V17_COMPLETO.md`
9. Ler `package.json` → stack e dependências
10. Listar `e2e/`, `src/test/` → cobertura de testes

### Entregável

Relatório estruturado em **chat** (sem alterações de código), organizado por:
- Visão geral & métricas
- Stack tecnológica
- Mapa de rotas & páginas (todas)
- Módulos de negócio (por domínio: Colaboradores, Folha, Férias, Ponto, Benefícios, SST, eSocial, Recrutamento, etc.)
- Backend (tabelas, views, RLS, edge functions, DB functions)
- Cálculos & validadores
- Integrações externas
- Segurança & compliance (LGPD, MFA, RLS, auditoria)
- IA/ML
- DevOps, testes, documentação
- Gaps conhecidos (do `ANALISE_FUNCIONALIDADES_PENDENTES.md`)

Sem mudanças de código — apenas leitura e relatório consolidado.

---

## Plano

Vou executar uma auditoria completa **somente leitura** do sistema "Departamento Pessoal", cobrindo:

**1. Frontend**
- Mapear todas as rotas em `src/App.tsx` (públicas, protegidas, admin-only)
- Catalogar páginas em `src/pages/` agrupadas por módulo de negócio
- Inventariar componentes em `src/components/` (ui, forms, dashboards, esocial, beneficios, sst, mobile, ai, etc.)
- Listar 272 hooks customizados por domínio
- Listar 121+ serviços categorizados

**2. Backend (Lovable Cloud)**
- 195 tabelas (negócio + sistema + lookup) — agrupar por domínio
- 17 views, 20 DB functions, triggers
- 34 Edge Functions (cálculos, integrações, segurança, infra)
- RLS policies & multi-tenant
- 6 storage buckets, secrets configurados

**3. Lógica de negócio**
- 18 calculadoras trabalhistas (INSS, IRRF, FGTS, férias, 13º, rescisão, horas extras, adicionais)
- 35 validadores eSocial (S-1000 a S-8299)
- Geração de guias (DARF, GPS, FGTS, DCTFWeb, REINF, CAGED, RAIS, DIRF)

**4. Integrações (55)**
- Bancos, ERPs, sistemas de ponto, plataformas de benefícios, Bitrix24, Resend, Lovable AI

**5. Segurança & Compliance**
- 42 módulos: MFA, SSO, criptografia, DLP, rate limiting, brute force, geo-blocking, IP whitelist, auditoria, LGPD

**6. IA/ML (28)**
- Predição (turnover, absenteísmo, custos), análise (sentimento, fraude), automação (chatbot, OCR via Gemini)

**7. Outros**
- Mobile/PWA (23), A11y (45), Performance (49), DevOps/CI-CD (38 workflows), Storybook (139 stories), testes (2.183), documentação (119)

**8. Histórico de versões (V3 → V19)**
- Sintetizar evolução a partir dos planos `PLANO_MASTER_V*` e `PLANO_IMPLEMENTACAO_V*`

**9. Gaps conhecidos**
- 46 lacunas funcionais documentadas em `ANALISE_FUNCIONALIDADES_PENDENTES.md`

### Entregável
Um relatório consolidado em chat (Markdown), estruturado por seções, com contagens, exemplos representativos e referências aos arquivos-chave. Nenhuma alteração de código.
