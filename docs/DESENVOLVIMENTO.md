# Guia de Desenvolvimento

## Setup

```bash
git clone https://github.com/adm01-debug/departamento-pessoal.git
cd departamento-pessoal
npm install
cp .env.example .env
npm run dev
```

## Convenções

### Commits

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação
- `refactor:` - Refatoração
- `test:` - Testes

### Branches

- `main` - Produção
- `develop` - Desenvolvimento
- `feature/*` - Novas funcionalidades
- `fix/*` - Correções

### Código

- TypeScript strict mode
- ESLint + Prettier
- Testes unitários para utils e hooks
