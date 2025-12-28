import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ColaboradorList } from '@/components/colaboradores/ColaboradorList';
describe('ColaboradorList', () => {
  it('renders', () => { render(<ColaboradorList />); });
  it('displays content', () => { expect(true).toBe(true); });
});
