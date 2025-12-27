import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TelefoneInput } from '@/components/form/TelefoneInput';
describe('TelefoneInput', () => { it('renderiza input', () => { render(<TelefoneInput value="" onChange={vi.fn()} />); expect(screen.getByRole('textbox')).toBeInTheDocument(); }); it('formata telefone', () => { const onChange = vi.fn(); render(<TelefoneInput value="" onChange={onChange} />); fireEvent.change(screen.getByRole('textbox'), { target: { value: '11999999999' } }); expect(onChange).toHaveBeenCalled(); }); });
