import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ModalHeader } from '@/components/modals/ModalHeader';
describe('ModalHeader', () => { it('renderiza header', () => { render(<ModalHeader title="Título" onClose={vi.fn()} />); expect(screen.getByText('Título')).toBeInTheDocument(); }); it('fecha modal', () => { const onClose = vi.fn(); render(<ModalHeader title="T" onClose={onClose} />); fireEvent.click(screen.getByRole('button')); expect(onClose).toHaveBeenCalled(); }); });
