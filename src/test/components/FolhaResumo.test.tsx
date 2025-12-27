import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FolhaResumo } from '@/components/folha/FolhaResumo';
const mockResumo = { totalBruto: 100000, totalDescontos: 20000, totalLiquido: 80000, colaboradores: 50 };
describe('FolhaResumo', () => { it('renderiza resumo', () => { render(<FolhaResumo resumo={mockResumo} />); expect(screen.getByText(/R\$/)).toBeInTheDocument(); }); });
