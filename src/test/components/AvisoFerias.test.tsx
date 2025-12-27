import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AvisoFerias } from '@/components/ferias/AvisoFerias';
const mockFerias = { colaborador: 'João', dataInicio: '2025-02-01', dataFim: '2025-02-15', diasGozo: 14 };
describe('AvisoFerias', () => {
  it('renderiza aviso de férias', () => {
    render(<AvisoFerias ferias={mockFerias} />);
    expect(screen.getByText('João')).toBeInTheDocument();
  });
  it('exibe período', () => {
    render(<AvisoFerias ferias={mockFerias} />);
    expect(screen.getByText(/14 dias/i)).toBeInTheDocument();
  });
});
