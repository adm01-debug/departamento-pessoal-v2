import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TelemetryCharts } from "@/components/admin/telemetry/TelemetryCharts";
import {
  createMockRow,
  createSlowRow,
  createVerySlowRow,
  createErrorRow,
  createMixedSeverityRows,
  createBulkRows,
  createTimeDistributedRows,
} from "./telemetry-helpers";

// Mock recharts to avoid SVG rendering issues in jsdom
vi.mock("recharts", () => {
  const MockResponsiveContainer = ({ children }: any) => <div data-testid="responsive-container">{children}</div>;
  const MockBarChart = ({ children, data }: any) => <div data-testid="bar-chart" data-count={data?.length}>{children}</div>;
  const MockPieChart = ({ children }: any) => <div data-testid="pie-chart">{children}</div>;
  const MockBar = ({ dataKey, name }: any) => <div data-testid={`bar-${dataKey}`} data-name={name} />;
  const MockXAxis = () => <div data-testid="x-axis" />;
  const MockYAxis = () => <div data-testid="y-axis" />;
  const MockCartesianGrid = () => <div data-testid="cartesian-grid" />;
  const MockTooltip = () => <div data-testid="tooltip" />;
  const MockPie = ({ data, children }: any) => <div data-testid="pie" data-count={data?.length}>{typeof children === "function" ? null : children}</div>;
  const MockCell = ({ fill }: any) => <div data-testid="cell" data-fill={fill} />;

  return {
    BarChart: MockBarChart,
    Bar: MockBar,
    XAxis: MockXAxis,
    YAxis: MockYAxis,
    CartesianGrid: MockCartesianGrid,
    Tooltip: MockTooltip,
    ResponsiveContainer: MockResponsiveContainer,
    PieChart: MockPieChart,
    Pie: MockPie,
    Cell: MockCell,
  };
});

describe("TelemetryCharts", () => {
  it("não renderiza nada quando rows está vazio", () => {
    const { container } = render(<TelemetryCharts rows={[]} timeFilter="24h" />);
    expect(container.innerHTML).toBe("");
  });

  it("renderiza gráficos quando há dados", () => {
    const rows = [createSlowRow(), createVerySlowRow(), createErrorRow()];
    render(<TelemetryCharts rows={rows} timeFilter="24h" />);
    expect(screen.getByText("Alertas ao Longo do Tempo")).toBeInTheDocument();
    expect(screen.getByText("Distribuição")).toBeInTheDocument();
  });

  it("renderiza bar chart com barras corretas", () => {
    const rows = [createSlowRow()];
    render(<TelemetryCharts rows={rows} timeFilter="24h" />);
    expect(screen.getByTestId("bar-slow")).toBeInTheDocument();
    expect(screen.getByTestId("bar-very_slow")).toBeInTheDocument();
    expect(screen.getByTestId("bar-error")).toBeInTheDocument();
  });

  it("renderiza pie chart", () => {
    const rows = createMixedSeverityRows({ slow: 5, very_slow: 3, error: 2 });
    render(<TelemetryCharts rows={rows} timeFilter="24h" />);
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  it("renderiza com timeFilter '1h'", () => {
    const rows = [createSlowRow()];
    render(<TelemetryCharts rows={rows} timeFilter="1h" />);
    expect(screen.getByText("Alertas ao Longo do Tempo")).toBeInTheDocument();
  });

  it("renderiza com timeFilter '6h'", () => {
    const rows = [createSlowRow()];
    render(<TelemetryCharts rows={rows} timeFilter="6h" />);
    expect(screen.getByText("Alertas ao Longo do Tempo")).toBeInTheDocument();
  });

  it("renderiza com timeFilter '7d'", () => {
    const rows = [createSlowRow()];
    render(<TelemetryCharts rows={rows} timeFilter="7d" />);
    expect(screen.getByText("Alertas ao Longo do Tempo")).toBeInTheDocument();
  });

  it("renderiza com uma única row", () => {
    render(<TelemetryCharts rows={[createMockRow({ severity: "slow" })]} timeFilter="24h" />);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("renderiza com centenas de rows sem erro", () => {
    const rows = createBulkRows(200, (i) => ({
      severity: i % 3 === 0 ? "slow" : i % 3 === 1 ? "very_slow" : "error",
    }));
    render(<TelemetryCharts rows={rows} timeFilter="24h" />);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  it("renderiza com rows distribuídas no tempo", () => {
    const rows = createTimeDistributedRows(12, 5, "slow");
    render(<TelemetryCharts rows={rows} timeFilter="24h" />);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("renderiza cells no pie chart para cada severidade", () => {
    const rows = createMixedSeverityRows({ slow: 5, very_slow: 3, error: 2 });
    render(<TelemetryCharts rows={rows} timeFilter="24h" />);
    const cells = screen.getAllByTestId("cell");
    expect(cells.length).toBe(3); // slow, very_slow, error
  });

  it("renderiza com severity 'normal' apenas (sem contagens de alerta)", () => {
    const rows = createBulkRows(10, () => ({ severity: "normal" }));
    render(<TelemetryCharts rows={rows} timeFilter="24h" />);
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  it("bar names são corretos", () => {
    const rows = [createSlowRow()];
    render(<TelemetryCharts rows={rows} timeFilter="24h" />);
    expect(screen.getByTestId("bar-slow")).toHaveAttribute("data-name", "Lentas");
    expect(screen.getByTestId("bar-very_slow")).toHaveAttribute("data-name", "Muito Lentas");
    expect(screen.getByTestId("bar-error")).toHaveAttribute("data-name", "Erros");
  });

  it("não crasheia com dados malformados", () => {
    const rows = [
      createMockRow({ severity: "slow", created_at: new Date(0).toISOString() }),
      createMockRow({ severity: "error", created_at: new Date(Date.now() + 999999999).toISOString() }),
    ];
    render(<TelemetryCharts rows={rows} timeFilter="24h" />);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });
});
