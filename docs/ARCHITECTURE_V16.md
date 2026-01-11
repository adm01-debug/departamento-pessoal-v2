# Architecture V16

## Stack
- React 18 + TypeScript
- Vite + SWC
- Tailwind CSS + shadcn/ui
- React Query v5
- Supabase (PostgreSQL + Auth + Storage)
- Vitest + Playwright

## Folder Structure
```
src/
├── components/          # UI Components
│   ├── ui/             # Base components (shadcn)
│   ├── forms/          # Form components
│   ├── modals/         # Modal components
│   └── ...
├── pages/              # Route pages
├── services/           # API services
│   ├── *.ts           # Mock services (legacy)
│   └── *.real.ts      # Production services V16
├── hooks/              # Custom hooks
│   ├── *.ts           # Legacy hooks
│   └── *.real.ts      # Production hooks V16
├── integrations/
│   └── supabase/      # Supabase config + types
├── i18n/              # Internationalization
├── lib/               # Utilities
├── calculators/       # Business logic calculators
├── validators/        # Input validators
└── types/             # TypeScript types

supabase/
└── migrations/        # Database migrations

e2e/                   # E2E tests (Playwright)
```

## Data Flow
1. Component → Hook → Service → Supabase
2. React Query for caching and state
3. RLS (Row Level Security) for authorization

## Security
- Rate limiting on sensitive endpoints
- Input sanitization (XSS prevention)
- RLS policies per table
- JWT-based authentication

## PWA
- Workbox for service worker
- Offline support with cache strategies
- Push notifications
- Background sync

