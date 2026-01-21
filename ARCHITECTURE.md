# 🏗️  Arquitetura do Sistema

## 📊 Visão Geral

Sistema web para gerenciamento completo de Departamento Pessoal com compliance total à legislação trabalhista brasileira.

## 🎯 Stack Tecnológico

### Frontend
- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component Library

### State Management
- **React Query** - Server State
- **Context API** - Global State
- **React Hook Form** - Form State

### Backend/Database
- **Supabase** - Backend as a Service
- **PostgreSQL** - Database
- **Row Level Security** - Autorização

## 📁 Estrutura de Pastas

```
src/
├── calculators/     # Cálculos trabalhistas (INSS, IRRF, etc)
├── components/      # Componentes React reutilizáveis
│   ├── ui/         # Componentes base (shadcn)
│   └── forms/      # Componentes de formulário
├── contexts/        # Contextos React
├── hooks/           # Custom React Hooks
├── lib/            # Utilitários e helpers
│   ├── validators/ # Validadores eSocial
│   └── utils/      # Funções auxiliares
├── pages/          # Páginas da aplicação
├── services/       # Integrações (API, Supabase)
├── types/          # Definições TypeScript
└── config/         # Configurações
```

## 🔄 Fluxo de Dados

```
User Interface (React)
      ↓
React Query (Cache)
      ↓
Services (API Layer)
      ↓
Supabase (Database)
```

## 🧮 Calculadoras

Sistema de cálculos 100% conforme legislação:

- **INSS** - Contribuição previdenciária
- **IRRF** - Imposto de renda
- **FGTS** - Fundo de garantia
- **Férias** - Cálculo de férias
- **13º Salário** - Gratificação natalina
- **Rescisão** - Cálculo rescisório
- **Horas Extras** - Adicional de horas
- **Adicionais** - Noturno, periculosidade, insalubridade

## 📋 Integrações Governamentais

### eSocial
- Eventos S-1000 a S-8299
- Validação offline completa
- Geração de XML

### Outros
- CAGED
- RAIS
- DIRF
- DCTFWeb
- SEFIP
- REINF

## 🔐 Segurança

### Autenticação
- Supabase Auth
- JWT Tokens
- Refresh Tokens

### Autorização
- Row Level Security (RLS)
- Role-Based Access Control (RBAC)
- Políticas no Supabase

### Dados Sensíveis
- Criptografia em repouso
- HTTPS obrigatório
- Dados pessoais anonimizados em logs

## 🚀 Performance

### Otimizações
- Code Splitting
- Lazy Loading
- Tree Shaking
- Bundle Optimization

### Caching
- React Query Cache
- Service Worker (futuro)
- CDN para assets

## 🧪 Testes

### Tipos
- Unitários (Vitest - futuro)
- Integração
- E2E (Cypress - futuro)

### Cobertura Alvo
- Calculadoras: 100%
- Services: 80%
- Components: 60%

## 📈 Monitoramento

### Métricas
- Tempo de build
- Bundle size
- Performance scores
- Error rates

### Ferramentas
- Lighthouse
- Vite Bundle Analyzer
- Sentry (futuro)

## 🔮 Roadmap

### Curto Prazo (V18)
- [ ] Testes completos
- [ ] CI/CD
- [ ] Documentação API

### Médio Prazo (V19)
- [ ] PWA
- [ ] Offline-first
- [ ] Mobile app

### Longo Prazo (V20+)
- [ ] Inteligência artificial
- [ ] Automação avançada
- [ ] Integrações ERP

---

**Versão:** 18.0  
**Última atualização:** Janeiro 2026
