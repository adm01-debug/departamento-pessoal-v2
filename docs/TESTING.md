# Testes

## Tecnologias
- Vitest
- React Testing Library
- MSW (Mock Service Worker)

## Executar Testes

```bash
# Rodar todos os testes
npm run test

# Com interface
npm run test:ui

# Com cobertura
npm run test:coverage
```

## Estrutura

```
src/
├── test/
│   ├── setup.ts
│   ├── utils.tsx
│   └── mocks/
│       ├── handlers.ts
│       └── server.ts
└── components/
    └── __tests__/
```

## Exemplo

```tsx
import{render,screen}from'@/test/utils';
import{Button}from'./Button';

test('renders button',()=>{
  render(<Button>Click</Button>);
  expect(screen.getByText('Click')).toBeInTheDocument();
});
```
