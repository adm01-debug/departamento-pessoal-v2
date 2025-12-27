import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RadioGroup } from '@/components/form/RadioGroup';
const mockOptions = [{ value: '1', label: 'Opção 1' }, { value: '2', label: 'Opção 2' }];
describe('RadioGroup', () => { it('renderiza opções', () => { render(<RadioGroup options={mockOptions} value="" onChange={vi.fn()} />); expect(screen.getByText('Opção 1')).toBeInTheDocument(); }); it('seleciona opção', () => { const onChange = vi.fn(); render(<RadioGroup options={mockOptions} value="" onChange={onChange} />); fireEvent.click(screen.getByText('Opção 1')); expect(onChange).toHaveBeenCalled(); }); });
