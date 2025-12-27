import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilterSelect } from '@/components/filters/FilterSelect';
const mockOptions = [{ value: '1', label: 'Op 1' }, { value: '2', label: 'Op 2' }];
describe('FilterSelect', () => { it('renderiza select', () => { render(<FilterSelect options={mockOptions} onChange={vi.fn()} />); expect(screen.getByRole('combobox')).toBeInTheDocument(); }); });
