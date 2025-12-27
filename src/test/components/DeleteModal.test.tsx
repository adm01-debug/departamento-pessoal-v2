import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DeleteModal } from '@/components/modals/DeleteModal';
describe('DeleteModal', () => { it('renderiza modal', () => { render(<DeleteModal isOpen onConfirm={vi.fn()} onCancel={vi.fn()} />); expect(screen.getByText(/excluir/i)).toBeInTheDocument(); }); it('executa onConfirm', () => { const onConfirm = vi.fn(); render(<DeleteModal isOpen onConfirm={onConfirm} onCancel={vi.fn()} />); fireEvent.click(screen.getByText(/confirmar/i)); expect(onConfirm).toHaveBeenCalled(); }); });
