import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DatePicker } from '@/components/form/DatePicker';
describe('DatePicker', () => { it('renderiza picker', () => { render(<DatePicker selected={null} onChange={vi.fn()} />); expect(screen.getByRole('textbox')).toBeInTheDocument(); }); });
