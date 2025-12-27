import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Trend } from '@/components/kpi/Trend';
describe('Trend', () => { it('renderiza trend positivo', () => { render(<Trend value={10} />); expect(screen.getByText('+10%')).toBeInTheDocument(); }); it('renderiza trend negativo', () => { render(<Trend value={-5} />); expect(screen.getByText('-5%')).toBeInTheDocument(); }); });
