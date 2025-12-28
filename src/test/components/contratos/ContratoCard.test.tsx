import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ContratoCard } from '@/components/contratos/ContratoCard';
describe('ContratoCard', () => {
  it('renders', () => { render(<ContratoCard />); expect(true).toBe(true); });
});
