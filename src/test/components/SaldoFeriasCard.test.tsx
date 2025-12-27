import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SaldoFeriasCard } from '@/components/ferias/SaldoFeriasCard';
const mockSaldo = { diasDisponiveis: 30, diasGozados: 10, diasPendentes: 20 };
describe('SaldoFeriasCard', () => { it('renderiza saldo', () => { render(<SaldoFeriasCard saldo={mockSaldo} />); expect(screen.getByText('30')).toBeInTheDocument(); }); });
