# 📦 Guia de Scripts - Package.json

## Scripts Recomendados para Adicionar

Adicione estes scripts úteis ao seu `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:optimized": "vite build --config vite.config.optimized.ts",
    "build:analyze": "vite build --config vite.analyze.config.ts",
    "preview": "vite preview",
    
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    
    "lint": "eslint . --ext ts,tsx",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    
    "format": "prettier --write \"src/**/*.{ts,tsx,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css,md}\"",
    
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    
    "clean": "rm -rf dist node_modules .turbo",
    "fresh": "npm run clean && npm install && npm run build",
    
    "docker:dev": "docker-compose -f docker-compose.dev.yml up",
    "docker:down": "docker-compose -f docker-compose.dev.yml down"
  }
}
```

## Como Adicionar

1. Abra seu `package.json`
2. Localize a seção `"scripts"`
3. Adicione os scripts acima que ainda não existem
4. Salve o arquivo

## Uso dos Scripts

### Desenvolvimento
```bash
npm run dev              # Inicia servidor de desenvolvimento
npm run type-check       # Verifica tipos TypeScript
```

### Build
```bash
npm run build            # Build padrão
npm run build:optimized  # Build com configuração otimizada
npm run build:analyze    # Build com análise de bundle
```

### Qualidade de Código
```bash
npm run lint             # Verifica código
npm run lint:fix         # Corrige problemas automaticamente
npm run format           # Formata código com Prettier
```

### Limpeza
```bash
npm run clean            # Remove arquivos gerados
npm run fresh            # Reinstala tudo do zero
```

### Docker
```bash
npm run docker:dev       # Inicia ambiente Docker
npm run docker:down      # Para ambiente Docker
```

## Scripts Úteis Adicionais

### Para CI/CD
```json
{
  "scripts": {
    "ci:install": "npm ci",
    "ci:build": "npm run type-check && npm run lint && npm run build",
    "ci:test": "npm run test -- --run"
  }
}
```

### Para Manutenção
```json
{
  "scripts": {
    "deps:check": "npm outdated",
    "deps:update": "npm update",
    "audit:fix": "npm audit fix"
  }
}
```

## Dicas

1. **Use `npm run`** para ver todos os scripts disponíveis
2. **Crie aliases** no seu `.bashrc` ou `.zshrc` para scripts frequentes
3. **Documente** scripts complexos com comentários no próprio comando

## Exemplo de package.json Completo

```json
{
  "name": "departamento-pessoal",
  "version": "18.0.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:optimized": "vite build --config vite.config.optimized.ts",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,md}\"",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist node_modules",
    "fresh": "npm run clean && npm install"
  }
}
```

---

**Última atualização:** Janeiro 2026  
**Versão:** 1.0
