import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AssinaturaDigitalModal } from '@/components/modals/AssinaturaDigitalModal';
describe('AssinaturaDigitalModal', () => {
  it('renderiza modal', () => {
    render(<AssinaturaDigitalModal isOpen onClose={vi.fn()} />);
    expect(screen.getByText(/assinatura/i)).toBeInTheDocument();
  });
  it('fecha modal', () => {
    const onClose = vi.fn();
    render(<AssinaturaDigitalModal isOpen onClose={onClose} />);
    fireEvent.click(screen.getByText(/cancelar/i));
    expect(onClose).toHaveBeenCalled();
  });
});
