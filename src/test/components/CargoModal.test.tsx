import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CargoModal } from '@/components/cargos/CargoModal';
describe('CargoModal', () => { it('renderiza modal', () => { render(<CargoModal isOpen onClose={vi.fn()} />); expect(screen.getByText(/cargo/i)).toBeInTheDocument(); }); it('fecha modal', () => { const onClose = vi.fn(); render(<CargoModal isOpen onClose={onClose} />); fireEvent.click(screen.getByText(/cancelar/i)); expect(onClose).toHaveBeenCalled(); }); });
