import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmpresaModal } from '@/components/empresas/EmpresaModal';
describe('EmpresaModal', () => { it('renderiza modal', () => { render(<EmpresaModal isOpen onClose={vi.fn()} />); expect(screen.getByText(/empresa/i)).toBeInTheDocument(); }); it('fecha modal', () => { const onClose = vi.fn(); render(<EmpresaModal isOpen onClose={onClose} />); fireEvent.click(screen.getByText(/cancelar/i)); expect(onClose).toHaveBeenCalled(); }); });
