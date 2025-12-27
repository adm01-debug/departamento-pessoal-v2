import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FeriadoModal } from '@/components/feriados/FeriadoModal';
describe('FeriadoModal', () => { it('renderiza modal', () => { render(<FeriadoModal isOpen onClose={vi.fn()} />); expect(screen.getByText(/feriado/i)).toBeInTheDocument(); }); it('fecha modal', () => { const onClose = vi.fn(); render(<FeriadoModal isOpen onClose={onClose} />); fireEvent.click(screen.getByText(/cancelar/i)); expect(onClose).toHaveBeenCalled(); }); });
