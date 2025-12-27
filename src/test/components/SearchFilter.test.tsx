import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SearchFilter } from '@/components/filters/SearchFilter';
describe('SearchFilter', () => { it('renderiza busca', () => { render(<SearchFilter onSearch={vi.fn()} />); expect(screen.getByPlaceholderText(/buscar/i)).toBeInTheDocument(); }); it('executa busca', () => { const onSearch = vi.fn(); render(<SearchFilter onSearch={onSearch} />); fireEvent.change(screen.getByPlaceholderText(/buscar/i), { target: { value: 'teste' } }); expect(onSearch).toHaveBeenCalled(); }); });
