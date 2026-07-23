# Changelog - Sistema Departamento Pessoal

## [18.0.1] - 2026-07-22

### Infrastructure
- Dockerfile: Node 18 → 22 LTS
- nginx.conf: fix try_files + proxy vars
- Branch protection workflow
- CODEOWNERS atualizado
- .gitignore aprimorado
- LICENSE atualizado

### Dependencies
- @playwright/test: 1.60.0 → 1.61.1
- vite: ^8.0.14 → ^8.1.4
- recharts: ^2.10.4 → ^3.9.2
- react-day-picker: ^9.6.0 → ^10.0.1
- @radix-ui/react-tabs: 1.1.14
- @radix-ui/react-avatar: 1.1.12
- react-hook-form: ^7.79.0
- dompurify: 3.4.7 → 3.4.12
- @types/node: ^26.1.1

### CI/CD
- All Dependabot PRs resolved
- Stale PRs closed
- 0 open issues/PRs

## [21.0.0] - 2026-01-20

### Adicionado (V21)
- Service CNAB 240 para pagamento folha
- Service de Contabilizacao - lancamentos contabeis
- Service de Simulacao Salarial completo
- Calculadora de Proporcionalidade de Verbas
- Tipos TypeScript para Colaborador, Folha, Empresa
- Testes para novos services
- Index de exports para Services

## [20.0.0] - 2026-01-20

### Adicionado (V20)
- Calculadora de Jornada de Trabalho
- Calculadora de Contribuicao Sindical
- Calculadora de Seguro Desemprego 2026
- Calculadora de Custos com Pessoal
- Service de Geracao de Recibos
- Service de Geracao de Guias (GPS, DARF, GRF)
- Service de Calculo de Encargos
- Service de Provisoes Contabeis
- Validador de Documentos BR (CPF, CNPJ, PIS)
- Constantes Trabalhistas 2026
- Feriados Nacionais 2026
- Hook useForm Avancado

## [19.0.0] - 2026-01-20

### Adicionado (V19)
- Query Optimizer Hook
- Skeleton Components
- Toast/Auth/Feature Stores
- Date/Currency Utils Brasil
- API Error Handler centralizado
- Permission Guard Component
- Audit Log Service

## [18.0.0] - 2026-01-20

### Adicionado (V18)
- 25 testes de calculadoras
- 36 testes validadores eSocial
- 20 testes E2E Cypress
- 10 services expandidos
- 10 hooks avancados
- CI/CD pipeline GitHub Actions
- Documentacao completa

## [17.4.0] - 2026-01-12
- Tabelas trabalhistas 2026
- Calculadoras atualizadas