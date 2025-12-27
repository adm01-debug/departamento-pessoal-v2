# Testes

## Estrutura

```
src/test/
├── components/    # Testes de componentes
├── hooks/         # Testes de hooks
├── services/      # Testes de services
├── contexts/      # Testes de contexts
├── utils/         # Testes de utilitários
├── a11y/          # Testes de acessibilidade
└── performance/   # Testes de performance
```

## Executar Testes

```bash
# Todos os testes
npm run test

# Com cobertura
npm run test:coverage

# Watch mode
npm run test:watch

# Arquivo específico
npm run test -- ComponentName
```

## Padrões

### Componentes
```tsx
import { render, screen } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  it('should render', () => {
    render(<Component />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

### Hooks
```tsx
import { renderHook, act } from '@testing-library/react';
import { useHook } from './useHook';

describe('useHook', () => {
  it('should return value', () => {
    const { result } = renderHook(() => useHook());
    expect(result.current.value).toBe(expected);
  });
});
```

## Meta de Cobertura

- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%
