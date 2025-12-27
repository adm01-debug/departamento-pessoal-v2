import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilterDate } from '@/components/filters/FilterDate';
describe('FilterDate', () => { it('renderiza filtro de data', () => { render(<FilterDate onChange={vi.fn()} />); expect(screen.getByRole('textbox')).toBeInTheDocument(); }); });
