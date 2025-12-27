import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CartaDesligamento } from '@/components/desligamentos/CartaDesligamento';
const mockData = { colaborador: 'João', cargo: 'Dev', dataDesligamento: '2025-01-31', motivo: 'Pedido' };
describe('CartaDesligamento', () => { it('renderiza carta', () => { render(<CartaDesligamento data={mockData} />); expect(screen.getByText('João')).toBeInTheDocument(); }); });
