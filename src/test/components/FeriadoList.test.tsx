import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FeriadoList } from '@/components/feriados/FeriadoList';
const mockFeriados = [{ id: '1', nome: 'Ano Novo' }, { id: '2', nome: 'Carnaval' }];
describe('FeriadoList', () => { it('renderiza lista', () => { render(<FeriadoList feriados={mockFeriados} />); expect(screen.getByText('Ano Novo')).toBeInTheDocument(); }); it('exibe vazio', () => { render(<FeriadoList feriados={[]} />); expect(screen.getByText(/nenhum feriado/i)).toBeInTheDocument(); }); });
