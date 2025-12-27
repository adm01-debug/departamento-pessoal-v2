import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RelatorioFilter } from '@/components/relatorios/RelatorioFilter';
describe('RelatorioFilter', () => { it('renderiza filtros', () => { render(<RelatorioFilter onFilter={vi.fn()} />); expect(screen.getByPlaceholderText(/buscar/i)).toBeInTheDocument(); }); });
