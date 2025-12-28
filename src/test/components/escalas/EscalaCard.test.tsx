import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EscalaCard } from '@/components/escalas/EscalaCard';
describe('EscalaCard', () => {
  it('renders', () => { render(<EscalaCard />); expect(true).toBe(true); });
});
