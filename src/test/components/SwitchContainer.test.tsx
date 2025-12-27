import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SwitchContainer } from '@/components/form/SwitchContainer';
describe('SwitchContainer', () => { it('renderiza switch', () => { render(<SwitchContainer label="Ativo" checked={false} onChange={vi.fn()} />); expect(screen.getByText('Ativo')).toBeInTheDocument(); }); it('altera estado', () => { const onChange = vi.fn(); render(<SwitchContainer label="S" checked={false} onChange={onChange} />); fireEvent.click(screen.getByRole('switch')); expect(onChange).toHaveBeenCalled(); }); });
