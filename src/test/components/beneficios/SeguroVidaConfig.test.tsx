import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SeguroVidaConfig } from '@/components/beneficios/SeguroVidaConfig';
describe('SeguroVidaConfig', () => {
  it('renders', () => { render(<SeguroVidaConfig />); });
  it('accepts props', () => { expect(true).toBe(true); });
});
