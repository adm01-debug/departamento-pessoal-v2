import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilterSearch } from '@/components/filters/FilterSearch';
describe('FilterSearch', () => { it('renderiza busca', () => { render(<FilterSearch onSearch={vi.fn()} />); expect(screen.getByPlaceholderText(/buscar/i)).toBeInTheDocument(); }); it('executa busca', () => { const onSearch = vi.fn(); render(<FilterSearch onSearch={onSearch} />); fireEvent.change(screen.getByPlaceholderText(/buscar/i), { target: { value: 'test' } }); expect(onSearch).toHaveBeenCalled(); }); });
