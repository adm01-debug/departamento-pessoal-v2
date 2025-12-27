import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DateFilter } from '@/components/filters/DateFilter';
describe('DateFilter', () => { it('renderiza filtro', () => { render(<DateFilter onChange={vi.fn()} />); expect(screen.getByRole('textbox')).toBeInTheDocument(); }); it('executa onChange', () => { const onChange = vi.fn(); render(<DateFilter onChange={onChange} />); fireEvent.change(screen.getByRole('textbox'), { target: { value: '2025-01-01' } }); expect(onChange).toHaveBeenCalled(); }); });
