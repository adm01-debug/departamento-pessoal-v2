import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StatusFilter } from '@/components/filters/StatusFilter';
describe('StatusFilter', () => { it('renderiza filtro', () => { render(<StatusFilter onChange={vi.fn()} />); expect(screen.getByRole('combobox')).toBeInTheDocument(); }); });
