import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TimePicker } from '@/components/form/TimePicker';
describe('TimePicker', () => { it('renderiza picker', () => { render(<TimePicker value="" onChange={vi.fn()} />); expect(screen.getByRole('textbox')).toBeInTheDocument(); }); });
