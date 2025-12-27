import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ConfigToggle } from '@/components/configuracoes/ConfigToggle';
describe('ConfigToggle', () => { it('renderiza toggle', () => { render(<ConfigToggle label="Ativo" checked={true} onChange={vi.fn()} />); expect(screen.getByText('Ativo')).toBeInTheDocument(); }); it('altera estado', () => { const onChange = vi.fn(); render(<ConfigToggle label="Toggle" checked={false} onChange={onChange} />); fireEvent.click(screen.getByRole('switch')); expect(onChange).toHaveBeenCalled(); }); });
