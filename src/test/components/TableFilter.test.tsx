import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TableFilter } from '@/components/tables/TableFilter';
describe('TableFilter', () => { it('renderiza filtro', () => { render(<TableFilter onFilter={vi.fn()} />); expect(screen.getByPlaceholderText(/filtrar/i)).toBeInTheDocument(); }); });
