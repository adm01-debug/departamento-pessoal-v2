# 🧪 Guia de Testes - V15

## Tipos de Testes

### Unit Tests (Vitest)
```typescript
import { describe, it, expect } from 'vitest';
import { formatCPF } from '@/lib/format';

describe('formatCPF', () => {
  it('should format CPF correctly', () => {
    expect(formatCPF('12345678900')).toBe('123.456.789-00');
  });
});
```

### Component Tests (Testing Library)
```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

test('renders button', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

### E2E Tests (Playwright)
```typescript
import { test, expect } from '@playwright/test';

test('login flow', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name=email]', 'user@test.com');
  await page.click('button[type=submit]');
  await expect(page).toHaveURL('/dashboard');
});
```

## Comandos
```bash
npm run test          # Unit tests
npm run test:ui       # Component tests
npm run test:e2e      # E2E tests
npm run test:coverage # Coverage report
```

## Cobertura Mínima
- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

