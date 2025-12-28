import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EscalaList } from '@/components/escalas/EscalaList';
describe('EscalaList', () => {
  it('renders', () => { render(<EscalaList />); expect(true).toBe(true); });
});
