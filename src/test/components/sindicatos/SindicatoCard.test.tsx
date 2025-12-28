import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SindicatoCard } from '@/components/sindicatos/SindicatoCard';
describe('SindicatoCard', () => {
  it('renders', () => { render(<SindicatoCard />); expect(true).toBe(true); });
});
