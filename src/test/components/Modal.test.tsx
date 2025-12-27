import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Modal } from '@/components/modals/Modal';
describe('Modal', () => { it('renderiza modal', () => { render(<Modal isOpen onClose={vi.fn()}><div>Conteúdo</div></Modal>); expect(screen.getByText('Conteúdo')).toBeInTheDocument(); }); it('fecha ao clicar no overlay', () => { const onClose = vi.fn(); render(<Modal isOpen onClose={onClose}><div>X</div></Modal>); fireEvent.click(screen.getByTestId('modal-overlay')); expect(onClose).toHaveBeenCalled(); }); });
