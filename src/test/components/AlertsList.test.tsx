import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AlertsList } from '@/components/feedback/AlertsList';
const mockAlerts = [{ id: '1', message: 'Alerta 1', type: 'info' }];
describe('AlertsList', () => {
  it('renderiza lista de alertas', () => {
    render(<AlertsList alerts={mockAlerts} />);
    expect(screen.getByText('Alerta 1')).toBeInTheDocument();
  });
  it('exibe mensagem vazia', () => {
    render(<AlertsList alerts={[]} />);
    expect(screen.getByText(/nenhum alerta/i)).toBeInTheDocument();
  });
});
