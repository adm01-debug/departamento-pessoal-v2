import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FeriasList } from '@/components/ferias/FeriasList';
const mockFerias = [{ id: '1', colaborador: 'João' }, { id: '2', colaborador: 'Maria' }];
describe('FeriasList', () => { it('renderiza lista', () => { render(<FeriasList ferias={mockFerias} />); expect(screen.getByText('João')).toBeInTheDocument(); expect(screen.getByText('Maria')).toBeInTheDocument(); }); it('exibe vazio', () => { render(<FeriasList ferias={[]} />); expect(screen.getByText(/nenhuma férias/i)).toBeInTheDocument(); }); });
