import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ColaboradorFormModal } from '@/components/colaboradores/ColaboradorFormModal';
describe('ColaboradorFormModal', () => { it('renderiza modal', () => { render(<ColaboradorFormModal isOpen onClose={vi.fn()} />); expect(screen.getByText(/colaborador/i)).toBeInTheDocument(); }); it('fecha modal', () => { const onClose = vi.fn(); render(<ColaboradorFormModal isOpen onClose={onClose} />); fireEvent.click(screen.getByText(/cancelar/i)); expect(onClose).toHaveBeenCalled(); }); });
