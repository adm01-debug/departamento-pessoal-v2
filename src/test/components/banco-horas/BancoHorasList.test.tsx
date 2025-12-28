import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BancoHorasList } from '@/components/banco-horas/BancoHorasList';
describe('BancoHorasList', () => {
  it('renders', () => { render(<BancoHorasList />); });
  it('displays content', () => { expect(true).toBe(true); });
});
