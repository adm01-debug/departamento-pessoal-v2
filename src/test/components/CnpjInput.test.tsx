import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CnpjInput } from '@/components/form/CnpjInput';
describe('CnpjInput', () => { it('renderiza input', () => { render(<CnpjInput value="" onChange={vi.fn()} />); expect(screen.getByRole('textbox')).toBeInTheDocument(); }); it('formata CNPJ', () => { const onChange = vi.fn(); render(<CnpjInput value="" onChange={onChange} />); fireEvent.change(screen.getByRole('textbox'), { target: { value: '12345678901234' } }); expect(onChange).toHaveBeenCalled(); }); });
