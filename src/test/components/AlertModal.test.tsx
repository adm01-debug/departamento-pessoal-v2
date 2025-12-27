import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AlertModal } from '@/components/modals/AlertModal';
describe('AlertModal', () => {
  it('renderiza modal de alerta', () => {
    render(<AlertModal isOpen title="Atenção" message="Mensagem" onClose={vi.fn()} />);
    expect(screen.getByText('Atenção')).toBeInTheDocument();
    expect(screen.getByText('Mensagem')).toBeInTheDocument();
  });
  it('executa onConfirm', () => {
    const onConfirm = vi.fn();
    render(<AlertModal isOpen title="Confirmar" message="Msg" onClose={vi.fn()} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByText(/confirmar/i));
    expect(onConfirm).toHaveBeenCalled();
  });
  it('aplica variante de perigo', () => {
    render(<AlertModal isOpen title="Perigo" message="Msg" variant="danger" onClose={vi.fn()} />);
    expect(screen.getByText('Perigo')).toBeInTheDocument();
  });
});
