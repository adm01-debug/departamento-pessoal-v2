import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BirthdayCard } from '@/components/dashboard/BirthdayCard';
const mockAniversariantes = [{ id: '1', nome: 'João', data: '01/15' }];
describe('BirthdayCard', () => {
  it('renderiza aniversariantes', () => { render(<BirthdayCard aniversariantes={mockAniversariantes} />); expect(screen.getByText('João')).toBeInTheDocument(); });
  it('exibe vazio', () => { render(<BirthdayCard aniversariantes={[]} />); expect(screen.getByText(/nenhum aniversariante/i)).toBeInTheDocument(); });
});
