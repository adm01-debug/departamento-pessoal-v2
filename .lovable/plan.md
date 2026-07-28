
Vou criar um documento `.md` consolidando a auditoria exaustiva já realizada do sistema Departamento Pessoal.

## O que será criado

**Arquivo:** `docs/AUDITORIA_SISTEMA_COMPLETA.md`

## Estrutura do documento

1. **Visão Geral & Métricas** — totais (páginas, tabelas, hooks, services, testes)
2. **Stack Tecnológica** — React 18, TS, Vite, Tailwind, shadcn, React Query, Lovable Cloud
3. **Mapa de Rotas (79)** — públicas, protegidas, admin-only
4. **Módulos de Negócio** — agrupados por domínio:
   - Core (Dashboard, KPIs, Perfil)
   - Gestão de Pessoas (Colaboradores, Empresas, Organograma, Cargos)
   - Folha de Pagamento (cálculo, holerites, rubricas, obrigações fiscais)
   - Tempo (Ponto, Férias, Horas Extras, Escalas, Banco de Horas)
   - SST & Compliance (EPIs, ASOs, Auditoria, LGPD, Canal de Ética)
   - Ciclo de Vida (Recrutamento, Onboarding, Treinamento, Desligamento)
5. **Backend (Lovable Cloud)** — 195 tabelas, 17 views, 20 DB functions, 34 Edge Functions, RLS, storage buckets
6. **Lógica de Negócio** — 18 calculadoras, 35 validadores eSocial, geradores de guias
7. **Integrações Externas** — Bitrix24, Resend, Lovable AI (Gemini), bancos previstos
8. **Segurança & Compliance** — RBAC, MFA, rate limiting, brute-force, geo-blocking, auditoria, LGPD
9. **IA/ML** — predição, OCR, chatbot
10. **Qualidade & DevOps** — 405 testes (Vitest), Storybook, CI/CD, documentação
11. **Histórico de Versões (V3 → V21)** — síntese da evolução
12. **Gaps Conhecidos (46)** — lacunas mapeadas em `ANALISE_FUNCIONALIDADES_PENDENTES.md`
13. **Conclusão & Próximos Passos**

Tamanho estimado: ~600-800 linhas de Markdown estruturado, com tabelas e listas hierárquicas.
