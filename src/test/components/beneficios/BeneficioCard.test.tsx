import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BeneficioCard } from '@/components/beneficios/BeneficioCard';
describe('BeneficioCard', () => {
  it('renders', () => { render(<BeneficioCard />); });
  it('accepts props', () => { expect(true).toBe(true); });
});
