import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TelemetryCharts } from "@/components/admin/telemetry/TelemetryCharts";
import {
  createMockRow, createSlowRow, createVerySlowRow, createErrorRow,
  createMixedSeverityRows, createBulkRows, createTimeDistributedRows,
} from "./telemetry-helpers";

// Mock recharts
vi.mock("recharts", () => {
  const MockResponsiveContainer = ({ children }: any) => <div data-testid="responsive-container">{children}</div>;
  const MockBarChart = ({ children, data }: any) => <div data-testid="bar-chart" data-count={data?.length}>{children}</div>;
  const MockPieChart = ({ children }: any) => <div data-testid="pie-chart">{children}</div>;
  const MockAreaChart = ({ children, data }: any) => <div data-testid="area-chart" data-count={data?.length}>{children}</div>;
  const MockBar = ({ dataKey, name }: any) => <div data-testid={`bar-${dataKey}`} data-name={name} />;
  const MockArea = ({ dataKey, name }: any) => <div data-testid={`area-${dataKey}`} data-name={name} />;
  const MockXAxis = () => <div data-testid="x-axis" />;
  const MockYAxis = () => <div data-testid="y-axis" />;
  const MockCartesianGrid = () => <div data-testid="cartesian-grid" />;
  const MockTooltip = () => <div data-testid="tooltip" />;
  const MockLegend = () => <div data-testid="legend" />;
  const MockPie = ({ data, children }: any) => <div data-testid="pie" data-count={data?.length}>{typeof children === "function" ? null : children}</div>;
  const MockCell = ({ fill }: any) => <div data-testid="cell" data-fill={fill} />;

  return {
    BarChart: MockBarChart,
    Bar: MockBar,
    AreaChart: MockAreaChart,
    Area: MockArea,
    XAxis: MockXAxis,
    YAxis: MockYAxis,
    CartesianGrid: MockCartesianGrid,
    Tooltip: MockTooltip,
    Legend: MockLegend,
    ResponsiveContainer: MockResponsiveContainer,
    PieChart: MockPieChart,
    Pie: MockPie,
    Cell: MockCell,
  };
});

describe("TelemetryCharts", () => {
  // === Basic rendering ===
  it("não renderiza nada quando rows está vazio", () => {
    const { container } = render(<TelemetryCharts rows={[]} timeFilter="24h" />);
    expect(container.innerHTML).toBe("");
  });

  it("renderiza todos os 4 gráficos quando há dados", () => {
    const rows = [createSlowRow(), createVerySlowRow(), createErrorRow()];
    render(<TelemetryCharts rows={rows} timeFilter="24h" />);
    expect(screen.getByText("Alertas ao Longo do Tempo")).toBeInTheDocument();
    expect(screen.getByText("Distribuição")).toBeInTheDocument();
    expect(screen.getByText("Duração Média / Máxima")).toBeInTheDocument();
    expect(screen.getByText("Alertas por Tabela")).toBeInTheDocument();
  });

  // === Stacked bar chart ===
  it("renderiza bar chart com barras corretas", () => {
    const rows = [createSlowRow()];
    render(<TelemetryCharts rows={rows} timeFilter="24h" />);
    expect(screen.getByTestId("bar-slow")).toBeInTheDocument();
    expect(screen.getByTestId("bar-very_slow")).toBeInTheDocument();
    expect(screen.getByTestId("bar-error")).toBeInTheDocument();
  });

  it("bar names são corretos", () => {
    const rows = [createSlowRow()];
    render(<TelemetryCharts rows={rows} timeFilter="24h" />);
    expect(screen.getByTestId("bar-slow")).toHaveAttribute("data-name", "Lentas");
    expect(screen.getByTestId("bar-very_slow")).toHaveAttribute("data-name", "Muito Lentas");
    expect(screen.getByTestId("bar-error")).toHaveAttribute("data-name", "Erros");
  });

  // === Pie chart ===
  it("renderiza pie chart", () => {
    const rows = createMixedSeverityRows({ slow: 5, very_slow: 3, error: 2 });
    render(<TelemetryCharts rows={rows} timeFilter="24h" />);
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  it("renderiza cells no pie chart para cada severidade", () => {
    const rows = createMixedSeverityRows({ slow: 5, very_slow: 3, error: 2 });
    render(<TelemetryCharts rows={rows} timeFilter="24h" />);
    const cells = screen.getAllByTestId("cell");
    expect(cells.length).toBe(3);
  });

  // === Area chart (duração) ===
  it("renderiza area chart de duração", () => {
    const rows = [createSlowRow(), createVerySlowRow()];
    render(<TelemetryCharts rows={rows} timeFilter="24h" />);
    expect(screen.getByTestId("area-maxMs")).toBeInTheDocument();
    expect(screen.getByTestId("area-mediaMs")).toBeInTheDocument();
  });

  it("area chart nomes são corretos", () => {
    const rows = [createSlowRow()];
    render(<TelemetryCharts rows={rows} timeFilter="24h" />);
    expect(screen.getByTestId("area-maxMs")).toHaveAttribute("data-name", "Máxima");
    expect(screen.getByTestId("area-mediaMs")).toHaveAttribute("data-name", "Média");
  });

  // === Horizontal bar chart (alertas por tabela) ===
  it("renderiza bar chart horizontal de alertas por tabela", () => {
    const rows = [
      createMockRow({ table_name: "users", severity: "slow" }),
      createMockRow({ table_name: "orders", severity: "slow" }),
    ];
    render(<TelemetryCharts rows={rows} timeFilter="24h" />);
    expect(screen.getByTestId("bar-alertas")).toBeInTheDocument();
  });

  it("bar alertas nome é correto", () => {
    const rows = [createSlowRow()];
    render(<TelemetryCharts rows={rows} timeFilter="24h" />);
    expect(screen.getByTestId("bar-alertas")).toHaveAttribute("data-name", "Alertas");
  });

  // === Different time filters ===
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

  it("renderiza com timeFilter 'custom'", () => {
    const rows = [createSlowRow()];
    render(<TelemetryCharts rows={rows} timeFilter="custom" />);
    expect(screen.getByText("Alertas ao Longo do Tempo")).toBeInTheDocument();
  });

  // === Edge cases ===
  it("renderiza com uma única row", () => {
    render(<TelemetryCharts rows={[createMockRow({ severity: "slow" })]} timeFilter="24h" />);
    expect(screen.getAllByTestId("bar-chart").length).toBeGreaterThanOrEqual(1);
  });

  it("renderiza com centenas de rows sem erro", () => {
    const rows = createBulkRows(200, (i) => ({
      severity: i % 3 === 0 ? "slow" : i % 3 === 1 ? "very_slow" : "error",
    }));
    render(<TelemetryCharts rows={rows} timeFilter="24h" />);
    expect(screen.getAllByTestId("bar-chart").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    expect(screen.getByTestId("area-chart")).toBeInTheDocument();
  });

  it("renderiza com rows distribuídas no tempo", () => {
    const rows = createTimeDistributedRows(12, 5, "slow");
    render(<TelemetryCharts rows={rows} timeFilter="24h" />);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("renderiza com severity 'normal' apenas", () => {
    const rows = createBulkRows(10, () => ({ severity: "normal" }));
    render(<TelemetryCharts rows={rows} timeFilter="24h" />);
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  it("não crasheia com dados malformados", () => {
    const rows = [
      createMockRow({ severity: "slow", created_at: new Date(0).toISOString() }),
      createMockRow({ severity: "error", created_at: new Date(Date.now() + 999999999).toISOString() }),
    ];
    render(<TelemetryCharts rows={rows} timeFilter="24h" />);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("renderiza legends em todos os gráficos", () => {
    const rows = [createSlowRow(), createVerySlowRow(), createErrorRow()];
    render(<TelemetryCharts rows={rows} timeFilter="24h" />);
    const legends = screen.getAllByTestId("legend");
    expect(legends.length).toBeGreaterThanOrEqual(2);
  });

  it("renderiza todos os responsive containers", () => {
    const rows = [createSlowRow()];
    render(<TelemetryCharts rows={rows} timeFilter="24h" />);
    const containers = screen.getAllByTestId("responsive-container");
    expect(containers.length).toBe(4);
  });

  it("renderiza com mix de tabelas e RPCs", () => {
    const rows = [
      createMockRow({ table_name: "users", rpc_name: null, severity: "slow" }),
      createMockRow({ table_name: null, rpc_name: "fn_calc", severity: "error" }),
      createMockRow({ table_name: null, rpc_name: null, severity: "very_slow" }),
    ];
    render(<TelemetryCharts rows={rows} timeFilter="24h" />);
    expect(screen.getByText("Alertas por Tabela")).toBeInTheDocument();
  });

  it("renderiza tooltips em todos os gráficos", () => {
    const rows = [createSlowRow()];
    render(<TelemetryCharts rows={rows} timeFilter="24h" />);
    const tooltips = screen.getAllByTestId("tooltip");
    expect(tooltips.length).toBe(4);
  });

  it("renderiza cartesian grids", () => {
    const rows = [createSlowRow()];
    render(<TelemetryCharts rows={rows} timeFilter="24h" />);
    const grids = screen.getAllByTestId("cartesian-grid");
    expect(grids.length).toBeGreaterThanOrEqual(3);
  });

  it("renderiza axes em todos os gráficos", () => {
    const rows = [createSlowRow()];
    render(<TelemetryCharts rows={rows} timeFilter="24h" />);
    const xAxes = screen.getAllByTestId("x-axis");
    const yAxes = screen.getAllByTestId("y-axis");
    expect(xAxes.length).toBeGreaterThanOrEqual(3);
    expect(yAxes.length).toBeGreaterThanOrEqual(3);
  });

  it("renderiza com todas as severidades presentes", () => {
    const rows = createMixedSeverityRows({ normal: 2, slow: 3, very_slow: 4, error: 5 });
    render(<TelemetryCharts rows={rows} timeFilter="24h" />);
    const cells = screen.getAllByTestId("cell");
    expect(cells.length).toBe(4);
  });

  it("renderiza corretamente com durações muito altas", () => {
    const rows = [
      createMockRow({ duration_ms: 60000, severity: "very_slow" }),
      createMockRow({ duration_ms: 120000, severity: "very_slow" }),
    ];
    render(<TelemetryCharts rows={rows} timeFilter="24h" />);
    expect(screen.getByText("Duração Média / Máxima")).toBeInTheDocument();
  });

  it("renderiza corretamente com durações zero", () => {
    const rows = [
      createMockRow({ duration_ms: 0, severity: "error" }),
    ];
    render(<TelemetryCharts rows={rows} timeFilter="24h" />);
    expect(screen.getByText("Duração Média / Máxima")).toBeInTheDocument();
  });
});
