import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MoneyInput } from '@/components/form/MoneyInput';
describe('MoneyInput', () => { it('renderiza input', () => { render(<MoneyInput value="" onChange={vi.fn()} />); expect(screen.getByRole('textbox')).toBeInTheDocument(); }); it('formata valor', () => { const onChange = vi.fn(); render(<MoneyInput value="" onChange={onChange} />); fireEvent.change(screen.getByRole('textbox'), { target: { value: '1000' } }); expect(onChange).toHaveBeenCalled(); }); });
