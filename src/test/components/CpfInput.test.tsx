import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CpfInput } from '@/components/form/CpfInput';
describe('CpfInput', () => { it('renderiza input', () => { render(<CpfInput value="" onChange={vi.fn()} />); expect(screen.getByRole('textbox')).toBeInTheDocument(); }); it('formata CPF', () => { const onChange = vi.fn(); render(<CpfInput value="" onChange={onChange} />); fireEvent.change(screen.getByRole('textbox'), { target: { value: '12345678901' } }); expect(onChange).toHaveBeenCalled(); }); });
