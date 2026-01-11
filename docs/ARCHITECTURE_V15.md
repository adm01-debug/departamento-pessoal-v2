# 🏗️ Arquitetura - V15

## Stack Tecnológica

### Frontend
- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component Library
- **React Query** - Server State
- **React Hook Form** - Forms
- **Zod** - Validation

### Backend
- **Supabase** - BaaS
- **PostgreSQL** - Database
- **Edge Functions** - Serverless

## Estrutura de Pastas
```
src/
├── components/     # UI Components
├── features/       # Feature Modules
├── hooks/          # Custom Hooks
├── lib/            # Utilities
├── pages/          # Route Pages
├── services/       # API Services
├── types/          # TypeScript Types
└── integrations/   # External APIs
```

## Padrões

### Feature Module
```
features/colaboradores/
├── api.ts          # API calls
├── hooks.ts        # React hooks
├── index.ts        # Exports
└── types.ts        # Types
```

### Component Pattern
```typescript
// Atomic Design
atoms/     → Button, Input
molecules/ → SearchBar, Card
organisms/ → DataTable, Form
templates/ → DashboardLayout
pages/     → ColaboradoresPage
```

## Fluxo de Dados
1. Page → Hook → Service → API
2. API → Service → Hook → State → UI

