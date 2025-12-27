import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DepartamentoCard } from '@/components/departamentos/DepartamentoCard';
const mockDept = { id: '1', nome: 'TI', responsavel: 'João', colaboradores: 10 };
describe('DepartamentoCard', () => { it('renderiza departamento', () => { render(<DepartamentoCard departamento={mockDept} />); expect(screen.getByText('TI')).toBeInTheDocument(); }); it('executa onClick', () => { const onClick = vi.fn(); render(<DepartamentoCard departamento={mockDept} onClick={onClick} />); fireEvent.click(screen.getByText('TI')); expect(onClick).toHaveBeenCalled(); }); });
