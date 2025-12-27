import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BeneficioModal } from '@/components/beneficios/BeneficioModal';
describe('BeneficioModal', () => {
  it('renderiza modal', () => { render(<BeneficioModal isOpen onClose={vi.fn()} />); expect(screen.getByText(/benefício/i)).toBeInTheDocument(); });
  it('fecha modal', () => { const onClose = vi.fn(); render(<BeneficioModal isOpen onClose={onClose} />); fireEvent.click(screen.getByText(/cancelar/i)); expect(onClose).toHaveBeenCalled(); });
});
