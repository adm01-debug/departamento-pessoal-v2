import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DepartamentoModal } from '@/components/departamentos/DepartamentoModal';
describe('DepartamentoModal', () => { it('renderiza modal', () => { render(<DepartamentoModal isOpen onClose={vi.fn()} />); expect(screen.getByText(/departamento/i)).toBeInTheDocument(); }); it('fecha modal', () => { const onClose = vi.fn(); render(<DepartamentoModal isOpen onClose={onClose} />); fireEvent.click(screen.getByText(/cancelar/i)); expect(onClose).toHaveBeenCalled(); }); });
