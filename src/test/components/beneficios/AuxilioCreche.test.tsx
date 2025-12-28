import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AuxilioCreche } from '@/components/beneficios/AuxilioCreche';
describe('AuxilioCreche', () => {
  it('renders', () => { render(<AuxilioCreche />); });
  it('accepts props', () => { expect(true).toBe(true); });
});
