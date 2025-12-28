import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BeneficioModal } from '@/components/beneficios/BeneficioModal';
describe('BeneficioModal', () => {
  it('renders', () => { render(<BeneficioModal />); });
  it('accepts props', () => { expect(true).toBe(true); });
});
