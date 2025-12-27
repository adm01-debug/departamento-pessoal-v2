import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SelectInput } from '@/components/form/SelectInput';
const mockOptions = [{ value: '1', label: 'Opção 1' }];
describe('SelectInput', () => { it('renderiza input', () => { render(<SelectInput options={mockOptions} value="" onChange={vi.fn()} />); expect(screen.getByRole('combobox')).toBeInTheDocument(); }); });
