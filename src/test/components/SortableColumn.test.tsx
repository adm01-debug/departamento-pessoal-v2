import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SortableColumn } from '@/components/tables/SortableColumn';
describe('SortableColumn', () => { it('renderiza coluna', () => { render(<SortableColumn label="Nome" onSort={vi.fn()} />); expect(screen.getByText('Nome')).toBeInTheDocument(); }); it('executa sort', () => { const onSort = vi.fn(); render(<SortableColumn label="Nome" onSort={onSort} />); fireEvent.click(screen.getByText('Nome')); expect(onSort).toHaveBeenCalled(); }); });
