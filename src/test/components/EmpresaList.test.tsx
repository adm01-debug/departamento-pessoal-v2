import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmpresaList } from '@/components/empresas/EmpresaList';
const mockEmpresas = [{ id: '1', nome: 'Emp A' }, { id: '2', nome: 'Emp B' }];
describe('EmpresaList', () => { it('renderiza lista', () => { render(<EmpresaList empresas={mockEmpresas} />); expect(screen.getByText('Emp A')).toBeInTheDocument(); }); it('exibe vazio', () => { render(<EmpresaList empresas={[]} />); expect(screen.getByText(/nenhuma empresa/i)).toBeInTheDocument(); }); });
