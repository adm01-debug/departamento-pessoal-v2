import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { InputLabel } from '@/components/form/InputLabel';
describe('InputLabel', () => { it('renderiza label', () => { render(<InputLabel htmlFor="test">Nome</InputLabel>); expect(screen.getByText('Nome')).toBeInTheDocument(); }); it('indica obrigatório', () => { render(<InputLabel htmlFor="x" required>Campo</InputLabel>); expect(screen.getByText('*')).toBeInTheDocument(); }); });
