import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AdmissionsLineChart } from '@/components/charts/AdmissionsLineChart';

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

const mockData = [
  { mes: 'Jan', admissoes: 10, desligamentos: 3 },
  { mes: 'Fev', admissoes: 15, desligamentos: 5 },
  { mes: 'Mar', admissoes: 8, desligamentos: 2 },
];

describe('AdmissionsLineChart', () => {
  it('renderiza o gráfico de linhas', () => {
    render(<AdmissionsLineChart data={mockData} />);
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('renderiza com dados vazios', () => {
    render(<AdmissionsLineChart data={[]} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('exibe título quando fornecido', () => {
    render(<AdmissionsLineChart data={mockData} title="Admissões x Desligamentos" />);
    expect(screen.getByText('Admissões x Desligamentos')).toBeInTheDocument();
  });

  it('aplica altura customizada', () => {
    const { container } = render(<AdmissionsLineChart data={mockData} height={350} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('exibe legenda', () => {
    render(<AdmissionsLineChart data={mockData} showLegend />);
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });
});
