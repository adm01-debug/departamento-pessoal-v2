import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ColaboradorCard } from '@/components/colaboradores/ColaboradorCard';
const mockColab = { id: '1', nome: 'João Silva', cargo: 'Dev', departamento: 'TI', foto: '' };
describe('ColaboradorCard', () => { it('renderiza colaborador', () => { render(<ColaboradorCard colaborador={mockColab} />); expect(screen.getByText('João Silva')).toBeInTheDocument(); }); it('executa onClick', () => { const onClick = vi.fn(); render(<ColaboradorCard colaborador={mockColab} onClick={onClick} />); fireEvent.click(screen.getByText('João Silva')); expect(onClick).toHaveBeenCalled(); }); });
