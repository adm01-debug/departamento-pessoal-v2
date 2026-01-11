// V15-368
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '@/components/ui/input';
describe('Input', () => {
  it('renders correctly', () => { render(<Input placeholder="Digite aqui" />); expect(screen.getByPlaceholderText('Digite aqui')).toBeInTheDocument(); });
  it('handles change', () => { const onChange = vi.fn(); render(<Input onChange={onChange} />); fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } }); expect(onChange).toHaveBeenCalled(); });
  it('can be disabled', () => { render(<Input disabled />); expect(screen.getByRole('textbox')).toBeDisabled(); });
});
