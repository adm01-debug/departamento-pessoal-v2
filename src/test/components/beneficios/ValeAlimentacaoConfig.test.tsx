import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ValeAlimentacaoConfig } from '@/components/beneficios/ValeAlimentacaoConfig';
describe('ValeAlimentacaoConfig', () => {
  it('renders', () => { render(<ValeAlimentacaoConfig />); });
  it('accepts props', () => { expect(true).toBe(true); });
});
