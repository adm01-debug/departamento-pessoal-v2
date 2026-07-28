# 🚀 Instruções de Build - Sistema Departamento Pessoal

## ✅ Build Otimizado (RECOMENDADO)

```bash
# 1. Instalar dependências
npm install

# 2. Build usando configuração otimizada
npm run build

# Ou, se quiser garantir ignorar testes:
npx tsc --project tsconfig.build.json && vite build
```

## 📋 Pré-requisitos

- Node.js 18+ 
- npm 9+

## 🔧 Configurações de Build

### tsconfig.build.json
Arquivo criado especificamente para build de produção que:
- Ignora todos os arquivos de teste
- Otimiza o processo de compilação
- Garante que testes não afetem o build

### .eslintignore
Evita que ESLint verifique arquivos de teste durante o build.

### .prettierignore  
Evita que Prettier formate arquivos de teste durante o build.

## 🎯 Troubleshooting

### Erro: "Cannot find module"
```bash
# Limpar e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Erro relacionado a testes
```bash
# Usar configuração específica de build
npx tsc --project tsconfig.build.json
```

### Build lento
```bash
# Build otimizado (ignora testes)
npx vite build --mode production
```

## ✅ Verificar Build

```bash
# Após build, testar localmente
npm run preview
```

## 📊 Scripts Disponíveis

- `npm run dev` - Desenvolvimento
- `npm run build` - Build de produção  
- `npm run preview` - Preview do build
- `npm run lint` - Verificar código

## 🔗 Mais Informações

- Vite: https://vitejs.dev/
- TypeScript: https://www.typescriptlang.org/
- React: https://react.dev/

---

**Última atualização:** 2026-01-21  
**Versão do sistema:** 18.0
