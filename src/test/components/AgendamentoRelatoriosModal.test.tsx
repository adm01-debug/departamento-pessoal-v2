import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AgendamentoRelatoriosModal } from '@/components/modals/AgendamentoRelatoriosModal';
describe('AgendamentoRelatoriosModal', () => {
  it('renderiza modal quando aberto', () => {
    render(<AgendamentoRelatoriosModal isOpen onClose={vi.fn()} />);
    expect(screen.getByText(/agendar relatório/i)).toBeInTheDocument();
  });
  it('não renderiza quando fechado', () => {
    render(<AgendamentoRelatoriosModal isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByText(/agendar relatório/i)).not.toBeInTheDocument();
  });
  it('chama onClose ao clicar em cancelar', () => {
    const onClose = vi.fn();
    render(<AgendamentoRelatoriosModal isOpen onClose={onClose} />);
    fireEvent.click(screen.getByText(/cancelar/i));
    expect(onClose).toHaveBeenCalled();
  });
  it('exibe opções de frequência', () => {
    render(<AgendamentoRelatoriosModal isOpen onClose={vi.fn()} />);
    expect(screen.getByText(/frequência/i)).toBeInTheDocument();
  });
});
