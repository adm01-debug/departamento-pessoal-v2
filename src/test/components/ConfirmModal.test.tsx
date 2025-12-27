import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
describe('ConfirmModal', () => { it('renderiza modal', () => { render(<ConfirmModal isOpen title="Confirmar" onConfirm={vi.fn()} onCancel={vi.fn()} />); expect(screen.getByText('Confirmar')).toBeInTheDocument(); }); it('executa onConfirm', () => { const onConfirm = vi.fn(); render(<ConfirmModal isOpen title="OK" onConfirm={onConfirm} onCancel={vi.fn()} />); fireEvent.click(screen.getByText(/confirmar/i)); expect(onConfirm).toHaveBeenCalled(); }); });
