import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Pagination } from '@/components/ui/Pagination';
describe('Pagination', () => { it('renderiza paginação', () => { render(<Pagination currentPage={1} totalPages={10} onPageChange={vi.fn()} />); expect(screen.getByText('1')).toBeInTheDocument(); }); it('muda página', () => { const onPageChange = vi.fn(); render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />); fireEvent.click(screen.getByText('2')); expect(onPageChange).toHaveBeenCalledWith(2); }); });
