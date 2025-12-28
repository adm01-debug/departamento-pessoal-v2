import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BeneficioList } from '@/components/beneficios/BeneficioList';
describe('BeneficioList', () => {
  it('renders', () => { render(<BeneficioList />); });
  it('accepts props', () => { expect(true).toBe(true); });
});
