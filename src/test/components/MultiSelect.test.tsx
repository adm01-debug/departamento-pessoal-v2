import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MultiSelect } from '@/components/form/MultiSelect';
const mockOptions = [{ value: '1', label: 'Opção 1' }, { value: '2', label: 'Opção 2' }];
describe('MultiSelect', () => { it('renderiza select', () => { render(<MultiSelect options={mockOptions} value={[]} onChange={vi.fn()} />); expect(screen.getByRole('combobox')).toBeInTheDocument(); }); });
