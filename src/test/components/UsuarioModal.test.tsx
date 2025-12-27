import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UsuarioModal } from '@/components/usuarios/UsuarioModal';
describe('UsuarioModal', () => { it('renderiza modal', () => { render(<UsuarioModal isOpen onClose={vi.fn()} />); expect(screen.getByText(/usuário/i)).toBeInTheDocument(); }); it('fecha modal', () => { const onClose = vi.fn(); render(<UsuarioModal isOpen onClose={onClose} />); fireEvent.click(screen.getByText(/cancelar/i)); expect(onClose).toHaveBeenCalled(); }); });
