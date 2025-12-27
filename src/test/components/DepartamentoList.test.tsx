import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DepartamentoList } from '@/components/departamentos/DepartamentoList';
const mockDepts = [{ id: '1', nome: 'TI' }, { id: '2', nome: 'RH' }];
describe('DepartamentoList', () => { it('renderiza lista', () => { render(<DepartamentoList departamentos={mockDepts} />); expect(screen.getByText('TI')).toBeInTheDocument(); expect(screen.getByText('RH')).toBeInTheDocument(); }); it('exibe vazio', () => { render(<DepartamentoList departamentos={[]} />); expect(screen.getByText(/nenhum departamento/i)).toBeInTheDocument(); }); });
