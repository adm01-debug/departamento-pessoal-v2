import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmpresaCard } from '@/components/empresas/EmpresaCard';
const mockEmpresa = { id: '1', nome: 'Empresa X', cnpj: '12345678901234' };
describe('EmpresaCard', () => { it('renderiza empresa', () => { render(<EmpresaCard empresa={mockEmpresa} />); expect(screen.getByText('Empresa X')).toBeInTheDocument(); }); it('executa onClick', () => { const onClick = vi.fn(); render(<EmpresaCard empresa={mockEmpresa} onClick={onClick} />); fireEvent.click(screen.getByText('Empresa X')); expect(onClick).toHaveBeenCalled(); }); });
