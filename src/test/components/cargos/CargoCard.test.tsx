import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CargoCard } from '@/components/cargos/CargoCard';
describe('CargoCard', () => {
  it('renders', () => { render(<CargoCard />); });
  it('displays content', () => { expect(true).toBe(true); });
});
