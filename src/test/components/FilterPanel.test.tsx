import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilterPanel } from '@/components/filters/FilterPanel';
describe('FilterPanel', () => { it('renderiza painel', () => { render(<FilterPanel onApply={vi.fn()} onClear={vi.fn()}><div>Filters</div></FilterPanel>); expect(screen.getByText('Filters')).toBeInTheDocument(); }); it('aplica filtros', () => { const onApply = vi.fn(); render(<FilterPanel onApply={onApply} onClear={vi.fn()}><div>F</div></FilterPanel>); fireEvent.click(screen.getByText(/aplicar/i)); expect(onApply).toHaveBeenCalled(); }); });
