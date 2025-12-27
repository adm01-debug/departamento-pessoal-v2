import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CepInput } from '@/components/form/CepInput';
describe('CepInput', () => { it('renderiza input', () => { render(<CepInput value="" onChange={vi.fn()} />); expect(screen.getByRole('textbox')).toBeInTheDocument(); }); it('formata CEP', () => { const onChange = vi.fn(); render(<CepInput value="" onChange={onChange} />); fireEvent.change(screen.getByRole('textbox'), { target: { value: '12345678' } }); expect(onChange).toHaveBeenCalled(); }); });
