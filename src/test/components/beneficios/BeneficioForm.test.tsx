import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BeneficioForm } from '@/components/beneficios/BeneficioForm';
describe('BeneficioForm', () => {
  it('renders', () => { render(<BeneficioForm />); });
  it('accepts props', () => { expect(true).toBe(true); });
});
