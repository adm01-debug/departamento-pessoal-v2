import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DesligamentoModal } from '@/components/desligamentos/DesligamentoModal';
describe('DesligamentoModal', () => { it('renderiza modal', () => { render(<DesligamentoModal isOpen onClose={vi.fn()} />); expect(screen.getByText(/desligamento/i)).toBeInTheDocument(); }); it('fecha modal', () => { const onClose = vi.fn(); render(<DesligamentoModal isOpen onClose={onClose} />); fireEvent.click(screen.getByText(/cancelar/i)); expect(onClose).toHaveBeenCalled(); }); });
