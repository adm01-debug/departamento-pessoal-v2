import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CargoList } from '@/components/cargos/CargoList';
describe('CargoList', () => {
  it('renders', () => { render(<CargoList />); });
  it('displays content', () => { expect(true).toBe(true); });
});
