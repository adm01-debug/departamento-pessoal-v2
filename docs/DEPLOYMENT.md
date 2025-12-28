# 🚀 Guia de Deploy - Departamento Pessoal

## Ambientes
- **Desenvolvimento:** localhost:5173
- **Staging:** staging.dp.example.com
- **Produção:** dp.example.com

## Pré-requisitos
- Node.js 20+
- npm 10+
- Supabase CLI
- Docker (opcional)

## Deploy Manual
```bash
npm ci
npm run build
npm run preview
```

## Deploy Vercel
```bash
vercel --prod
```

## Deploy Docker
```bash
docker build -t dp-app .
docker run -p 3000:3000 dp-app
```

## Variáveis de Ambiente
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_BITRIX24_WEBHOOK=
```

## Checklist Pré-Deploy
- [ ] Testes passando
- [ ] Build sem erros
- [ ] Variáveis configuradas
- [ ] Migrations aplicadas
- [ ] Edge functions deployadas

## Rollback
```bash
vercel rollback
```

## Monitoramento
- Sentry para erros
- Analytics para métricas
- Uptime monitoring

---
Gerado: 28/12/2025
