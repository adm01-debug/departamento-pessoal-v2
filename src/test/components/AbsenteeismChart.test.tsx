import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AbsenteeismChart } from '@/components/charts/AbsenteeismChart';

// Mock recharts
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

const mockData = [
  { mes: 'Jan', faltas: 5, atestados: 3 },
  { mes: 'Fev', faltas: 8, atestados: 2 },
  { mes: 'Mar', faltas: 3, atestados: 5 },
];

describe('AbsenteeismChart', () => {
  it('renderiza o gráfico corretamente', () => {
    render(<AbsenteeismChart data={mockData} />);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('renderiza com dados vazios', () => {
    render(<AbsenteeismChart data={[]} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('exibe título quando fornecido', () => {
    render(<AbsenteeismChart data={mockData} title="Absenteísmo" />);
    expect(screen.getByText('Absenteísmo')).toBeInTheDocument();
  });

  it('aplica altura customizada', () => {
    const { container } = render(<AbsenteeismChart data={mockData} height={400} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
