import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SelectFilter } from '@/components/filters/SelectFilter';
const mockOptions = [{ value: '1', label: 'Opt 1' }];
describe('SelectFilter', () => { it('renderiza filtro', () => { render(<SelectFilter options={mockOptions} onChange={vi.fn()} />); expect(screen.getByRole('combobox')).toBeInTheDocument(); }); });
