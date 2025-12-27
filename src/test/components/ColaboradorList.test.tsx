import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ColaboradorList } from '@/components/colaboradores/ColaboradorList';
const mockColabs = [{ id: '1', nome: 'João' }, { id: '2', nome: 'Maria' }];
describe('ColaboradorList', () => { it('renderiza lista', () => { render(<ColaboradorList colaboradores={mockColabs} />); expect(screen.getByText('João')).toBeInTheDocument(); expect(screen.getByText('Maria')).toBeInTheDocument(); }); it('exibe vazio', () => { render(<ColaboradorList colaboradores={[]} />); expect(screen.getByText(/nenhum colaborador/i)).toBeInTheDocument(); }); });
