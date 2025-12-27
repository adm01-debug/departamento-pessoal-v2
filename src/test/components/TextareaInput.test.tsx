import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TextareaInput } from '@/components/form/TextareaInput';
describe('TextareaInput', () => { it('renderiza com label', () => { render(<TextareaInput label="Observações" value="" onChange={vi.fn()} />); expect(screen.getByText('Observações')).toBeInTheDocument(); }); });
