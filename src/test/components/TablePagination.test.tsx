import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TablePagination } from '@/components/tables/TablePagination';
describe('TablePagination', () => { it('renderiza paginação', () => { render(<TablePagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />); expect(screen.getByText('1')).toBeInTheDocument(); }); it('muda página', () => { const onPageChange = vi.fn(); render(<TablePagination currentPage={1} totalPages={5} onPageChange={onPageChange} />); fireEvent.click(screen.getByText('2')); expect(onPageChange).toHaveBeenCalledWith(2); }); });
