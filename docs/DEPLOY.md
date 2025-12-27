# Deploy

## Ambientes

| Ambiente | URL | Branch |
|----------|-----|--------|
| Produção | https://dp.promobrindes.com.br | main |
| Staging | https://dp-staging.promobrindes.com.br | develop |

## Deploy Manual

```bash
# Build
npm run build

# Preview
npm run preview
```

## Variáveis de Ambiente

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_URL=
VITE_BITRIX24_WEBHOOK=
```

## Checklist Pre-Deploy

- [ ] Testes passando
- [ ] Build sem erros
- [ ] Variáveis configuradas
- [ ] Migrations executadas
- [ ] Cache limpo
