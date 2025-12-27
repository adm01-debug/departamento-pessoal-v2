import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Comparison } from '@/components/charts/Comparison';
describe('Comparison', () => { it('renderiza comparação', () => { render(<Comparison current={100} previous={80} />); expect(screen.getByText('100')).toBeInTheDocument(); }); it('exibe percentual', () => { render(<Comparison current={100} previous={80} showPercent />); expect(screen.getByText(/25%/)).toBeInTheDocument(); }); });
