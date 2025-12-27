import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GerenciamentoPeriodos } from '@/components/periodos/GerenciamentoPeriodos';
describe('GerenciamentoPeriodos', () => { it('renderiza gerenciamento', () => { render(<GerenciamentoPeriodos onSelect={vi.fn()} />); expect(screen.getByText(/período/i)).toBeInTheDocument(); }); });
