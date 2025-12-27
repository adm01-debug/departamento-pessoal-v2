import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RelatorioCard } from '@/components/relatorios/RelatorioCard';
const mockRelatorio = { id: '1', nome: 'Folha Mensal', tipo: 'folha', geradoEm: '2025-01-01' };
describe('RelatorioCard', () => { it('renderiza relatório', () => { render(<RelatorioCard relatorio={mockRelatorio} />); expect(screen.getByText('Folha Mensal')).toBeInTheDocument(); }); it('executa onClick', () => { const onClick = vi.fn(); render(<RelatorioCard relatorio={mockRelatorio} onClick={onClick} />); fireEvent.click(screen.getByText('Folha Mensal')); expect(onClick).toHaveBeenCalled(); }); });
