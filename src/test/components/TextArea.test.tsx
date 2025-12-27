import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TextArea } from '@/components/form/TextArea';
describe('TextArea', () => { it('renderiza textarea', () => { render(<TextArea value="" onChange={vi.fn()} />); expect(screen.getByRole('textbox')).toBeInTheDocument(); }); it('atualiza valor', () => { const onChange = vi.fn(); render(<TextArea value="" onChange={onChange} />); fireEvent.change(screen.getByRole('textbox'), { target: { value: 'texto' } }); expect(onChange).toHaveBeenCalled(); }); });
