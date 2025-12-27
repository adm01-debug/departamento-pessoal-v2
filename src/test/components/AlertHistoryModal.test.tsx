import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AlertHistoryModal } from '@/components/modals/AlertHistoryModal';
const mockHistory = [
  { id: '1', message: 'Alerta 1', date: '2025-01-01', type: 'info' },
  { id: '2', message: 'Alerta 2', date: '2025-01-02', type: 'warning' },
];
describe('AlertHistoryModal', () => {
  it('renderiza histórico de alertas', () => {
    render(<AlertHistoryModal isOpen history={mockHistory} onClose={vi.fn()} />);
    expect(screen.getByText('Alerta 1')).toBeInTheDocument();
  });
  it('fecha ao clicar em fechar', () => {
    const onClose = vi.fn();
    render(<AlertHistoryModal isOpen history={mockHistory} onClose={onClose} />);
    fireEvent.click(screen.getByText(/fechar/i));
    expect(onClose).toHaveBeenCalled();
  });
});
