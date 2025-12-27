import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CargoList } from '@/components/cargos/CargoList';
const mockCargos = [{ id: '1', nome: 'Dev' }, { id: '2', nome: 'QA' }];
describe('CargoList', () => { it('renderiza lista', () => { render(<CargoList cargos={mockCargos} />); expect(screen.getByText('Dev')).toBeInTheDocument(); }); it('exibe vazio', () => { render(<CargoList cargos={[]} />); expect(screen.getByText(/nenhum cargo/i)).toBeInTheDocument(); }); });
