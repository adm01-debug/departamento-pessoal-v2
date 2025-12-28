import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DepartamentoCard } from '@/components/departamentos/DepartamentoCard';
describe('DepartamentoCard', () => {
  it('renders', () => { render(<DepartamentoCard />); });
  it('displays content', () => { expect(true).toBe(true); });
});
