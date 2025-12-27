import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CheckboxInput } from '@/components/form/CheckboxInput';
describe('CheckboxInput', () => { it('renderiza com label', () => { render(<CheckboxInput label="Aceito" checked={false} onChange={vi.fn()} />); expect(screen.getByText('Aceito')).toBeInTheDocument(); }); });
