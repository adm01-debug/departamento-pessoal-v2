import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RelatorioList } from '@/components/relatorios/RelatorioList';
const mockRelatorios = [{ id: '1', nome: 'Rel 1' }, { id: '2', nome: 'Rel 2' }];
describe('RelatorioList', () => { it('renderiza lista', () => { render(<RelatorioList relatorios={mockRelatorios} />); expect(screen.getByText('Rel 1')).toBeInTheDocument(); }); it('exibe vazio', () => { render(<RelatorioList relatorios={[]} />); expect(screen.getByText(/nenhum relatório/i)).toBeInTheDocument(); }); });
