import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UsuarioCard } from '@/components/usuarios/UsuarioCard';
const mockUsuario = { id: '1', nome: 'Admin', email: 'admin@test.com', role: 'admin' };
describe('UsuarioCard', () => { it('renderiza usuário', () => { render(<UsuarioCard usuario={mockUsuario} />); expect(screen.getByText('Admin')).toBeInTheDocument(); }); it('executa onClick', () => { const onClick = vi.fn(); render(<UsuarioCard usuario={mockUsuario} onClick={onClick} />); fireEvent.click(screen.getByText('Admin')); expect(onClick).toHaveBeenCalled(); }); });
