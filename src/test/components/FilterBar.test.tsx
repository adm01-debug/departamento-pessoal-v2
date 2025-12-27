import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilterBar } from '@/components/filters/FilterBar';
describe('FilterBar', () => { it('renderiza barra de filtros', () => { render(<FilterBar onFilter={vi.fn()} />); expect(screen.getByRole('search')).toBeInTheDocument(); }); });
