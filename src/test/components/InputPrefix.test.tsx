import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { InputPrefix } from '@/components/form/InputPrefix';
describe('InputPrefix', () => { it('renderiza prefixo', () => { render(<InputPrefix>R$</InputPrefix>); expect(screen.getByText('R$')).toBeInTheDocument(); }); });
