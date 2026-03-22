import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TurnoverChart } from '../TurnoverChart';

// Mock recharts
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  ComposedChart: ({ children }: any) => <div data-testid="composed-chart">{children}</div>,
  BarChart: ({ children }: any) => <div>{children}</div>,
  Bar: () => <div data-testid="bar" />,
  Line: () => <div data-testid="line" />,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('TurnoverChart', () => {
  it('renders without crashing', () => {
    render(<TurnoverChart desligamentos={[]} />);
    expect(screen.getByText(/Turnover Mensal/)).toBeInTheDocument();
  });

  it('renders chart container', () => {
    render(<TurnoverChart desligamentos={[]} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders with data', () => {
    const data = [
      { id: '1', data_desligamento: new Date().toISOString(), tipo: 'sem_justa_causa' },
      { id: '2', data_desligamento: new Date().toISOString(), tipo: 'pedido_demissao' },
    ];
    expect(() => render(<TurnoverChart desligamentos={data} />)).not.toThrow();
  });

  it('handles null data_desligamento', () => {
    const data = [{ id: '1', data_desligamento: null, tipo: 'sem_justa_causa' }];
    expect(() => render(<TurnoverChart desligamentos={data as any} />)).not.toThrow();
  });

  it('handles old dates outside 12-month range', () => {
    const data = [{ id: '1', data_desligamento: '2020-01-01', tipo: 'sem_justa_causa' }];
    expect(() => render(<TurnoverChart desligamentos={data} />)).not.toThrow();
  });
});
