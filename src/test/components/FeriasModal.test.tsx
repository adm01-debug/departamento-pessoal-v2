import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FeriasModal } from '@/components/ferias/FeriasModal';
describe('FeriasModal', () => { it('renderiza modal', () => { render(<FeriasModal isOpen onClose={vi.fn()} />); expect(screen.getByText(/férias/i)).toBeInTheDocument(); }); it('fecha modal', () => { const onClose = vi.fn(); render(<FeriasModal isOpen onClose={onClose} />); fireEvent.click(screen.getByText(/cancelar/i)); expect(onClose).toHaveBeenCalled(); }); });
