# Guia de Desenvolvimento

## Setup

```bash
# Clone
git clone https://github.com/adm01-debug/departamento-pessoal.git
cd departamento-pessoal

# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env

# Rodar desenvolvimento
npm run dev
```

## Scripts

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run test` | Rodar testes |
| `npm run test:coverage` | Testes com cobertura |
| `npm run lint` | Verificar código |
| `npm run storybook` | Documentação de componentes |
| `npm run e2e` | Testes end-to-end |

## Estrutura de Pastas

```
src/
├── components/    # Componentes React
├── contexts/      # React Context providers
├── hooks/         # Custom hooks
├── lib/           # Utilitários e helpers
├── pages/         # Páginas da aplicação
├── services/      # Serviços de API
├── test/          # Arquivos de teste
└── types/         # TypeScript types
```

## Convenções

- Componentes: PascalCase
- Hooks: camelCase com prefixo `use`
- Services: camelCase com sufixo `Service`
- Testes: mesmo nome do arquivo + `.test.ts(x)`
