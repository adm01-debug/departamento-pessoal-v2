import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DateInput } from '@/components/form/DateInput';
describe('DateInput', () => { it('renderiza input', () => { render(<DateInput value="" onChange={vi.fn()} />); expect(screen.getByRole('textbox')).toBeInTheDocument(); }); it('formata data', () => { const onChange = vi.fn(); render(<DateInput value="" onChange={onChange} />); fireEvent.change(screen.getByRole('textbox'), { target: { value: '01012025' } }); expect(onChange).toHaveBeenCalled(); }); });
