import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AlertBanner } from '@/components/feedback/AlertBanner';
describe('AlertBanner', () => {
  it('renderiza banner de alerta', () => {
    render(<AlertBanner message="Aviso importante" />);
    expect(screen.getByText('Aviso importante')).toBeInTheDocument();
  });
  it('permite fechar o banner', () => {
    const onClose = vi.fn();
    render(<AlertBanner message="Fechável" onClose={onClose} dismissible />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalled();
  });
  it('aplica variante warning', () => {
    const { container } = render(<AlertBanner message="Aviso" variant="warning" />);
    expect(container.firstChild).toBeInTheDocument();
  });
  it('exibe ação quando fornecida', () => {
    render(<AlertBanner message="Com ação" actionLabel="Clique" onAction={vi.fn()} />);
    expect(screen.getByText('Clique')).toBeInTheDocument();
  });
});
