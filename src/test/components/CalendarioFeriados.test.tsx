import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CalendarioFeriados } from '@/components/feriados/CalendarioFeriados';
const mockFeriados = [{ id: '1', nome: 'Ano Novo', data: '2025-01-01' }];
describe('CalendarioFeriados', () => {
  it('renderiza feriados', () => { render(<CalendarioFeriados feriados={mockFeriados} />); expect(screen.getByText('Ano Novo')).toBeInTheDocument(); });
});
