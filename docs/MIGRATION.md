# 🔄 MIGRATION.md - Guia de Migração

## v1.x para v2.x

### Breaking Changes
1. API de autenticação alterada
2. Estrutura de rotas nova
3. Context providers renomeados

### Passos
```bash
npm install @latest
npm run migrate:v2
npm run db:migrate
```

### Rollback
```bash
git checkout v1.x
npm run db:rollback
```
