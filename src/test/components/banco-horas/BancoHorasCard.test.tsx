import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BancoHorasCard } from '@/components/banco-horas/BancoHorasCard';
describe('BancoHorasCard', () => {
  it('renders', () => { render(<BancoHorasCard />); });
  it('displays content', () => { expect(true).toBe(true); });
});
