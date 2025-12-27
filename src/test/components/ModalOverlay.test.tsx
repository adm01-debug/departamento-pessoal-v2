import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ModalOverlay } from '@/components/modals/ModalOverlay';
describe('ModalOverlay', () => { it('renderiza overlay', () => { render(<ModalOverlay onClick={vi.fn()} />); expect(screen.getByTestId('modal-overlay')).toBeInTheDocument(); }); it('executa onClick', () => { const onClick = vi.fn(); render(<ModalOverlay onClick={onClick} />); fireEvent.click(screen.getByTestId('modal-overlay')); expect(onClick).toHaveBeenCalled(); }); });
