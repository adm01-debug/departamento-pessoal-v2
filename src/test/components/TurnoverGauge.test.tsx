import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TurnoverGauge } from '@/components/charts/TurnoverGauge';
vi.mock('recharts', () => ({ ResponsiveContainer: ({ children }: any) => <div>{children}</div>, PieChart: ({ children }: any) => <div data-testid="tg">{children}</div>, Pie: () => <div />, Cell: () => <div /> }));
describe('TurnoverGauge', () => { it('renderiza gauge', () => { render(<TurnoverGauge value={8} />); expect(screen.getByTestId('tg')).toBeInTheDocument(); }); });
