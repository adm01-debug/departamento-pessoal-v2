import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { InputContainer } from '@/components/form/InputContainer';
describe('InputContainer', () => { it('renderiza container', () => { render(<InputContainer><input /></InputContainer>); expect(screen.getByRole('textbox')).toBeInTheDocument(); }); });
