# 🏗️ Arquitetura do Sistema

## Visão Geral

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React)                      │
├─────────────────────────────────────────────────────────┤
│  Pages    │  Components  │  Hooks    │  Contexts        │
├─────────────────────────────────────────────────────────┤
│                     Services Layer                        │
├─────────────────────────────────────────────────────────┤
│                   Supabase (Backend)                      │
│  Auth  │  Database  │  Storage  │  Realtime  │  Edge    │
└─────────────────────────────────────────────────────────┘
```

## Camadas

### 1. Apresentação (UI)
- **Components:** Componentes React reutilizáveis
- **Pages:** Páginas da aplicação
- **Layouts:** Estruturas de layout

### 2. Lógica de Negócio
- **Hooks:** Custom hooks para lógica
- **Contexts:** Estado global
- **Services:** Comunicação com API

### 3. Dados
- **Supabase:** Backend as a Service
- **TanStack Query:** Cache e sincronização

## Padrões

- **Atomic Design:** Componentes organizados por complexidade
- **Container/Presentational:** Separação de lógica e UI
- **Feature-based:** Organização por funcionalidade
- **Type-safe:** TypeScript + Zod

## Segurança

- Row Level Security (RLS)
- JWT Authentication
- Role-based Access Control
- Audit Logging
