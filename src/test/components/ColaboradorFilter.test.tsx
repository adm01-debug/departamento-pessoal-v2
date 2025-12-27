import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ColaboradorFilter } from '@/components/colaboradores/ColaboradorFilter';
describe('ColaboradorFilter', () => { it('renderiza filtros', () => { render(<ColaboradorFilter onFilter={vi.fn()} />); expect(screen.getByPlaceholderText(/buscar/i)).toBeInTheDocument(); }); it('executa onFilter', () => { const onFilter = vi.fn(); render(<ColaboradorFilter onFilter={onFilter} />); fireEvent.change(screen.getByPlaceholderText(/buscar/i), { target: { value: 'João' } }); expect(onFilter).toHaveBeenCalled(); }); });
