import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ColaboradorFormCompleto } from '@/components/colaboradores/ColaboradorFormCompleto';
describe('ColaboradorFormCompleto', () => { it('renderiza formulário', () => { render(<ColaboradorFormCompleto onSubmit={vi.fn()} />); expect(screen.getByLabelText(/nome/i)).toBeInTheDocument(); }); });
