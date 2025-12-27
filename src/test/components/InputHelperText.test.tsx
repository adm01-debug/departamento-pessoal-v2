import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { InputHelperText } from '@/components/form/InputHelperText';
describe('InputHelperText', () => { it('renderiza texto', () => { render(<InputHelperText>Texto de ajuda</InputHelperText>); expect(screen.getByText('Texto de ajuda')).toBeInTheDocument(); }); });
