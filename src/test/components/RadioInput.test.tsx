import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RadioInput } from '@/components/form/RadioInput';
describe('RadioInput', () => { it('renderiza radio', () => { render(<RadioInput label="Opção" value="opt" checked={false} onChange={vi.fn()} />); expect(screen.getByText('Opção')).toBeInTheDocument(); }); });
