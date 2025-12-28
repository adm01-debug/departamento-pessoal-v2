import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RelatorioCard } from '@/components/relatorios/RelatorioCard';
describe('RelatorioCard', () => {
  it('renders', () => { render(<RelatorioCard />); expect(true).toBe(true); });
});
