import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmpresaSelector } from '@/components/empresas/EmpresaSelector';
const mockEmpresas = [{ id: '1', nome: 'Emp 1' }];
describe('EmpresaSelector', () => { it('renderiza selector', () => { render(<EmpresaSelector empresas={mockEmpresas} onChange={vi.fn()} />); expect(screen.getByRole('combobox')).toBeInTheDocument(); }); });
