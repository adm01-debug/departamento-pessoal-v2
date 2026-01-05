import type { Meta, StoryObj } from "@storybook/react";
import { AnalyticsHeadcount } from "./AnalyticsHeadcount";
const meta: Meta<typeof AnalyticsHeadcount> = { title: "Analytics/Headcount", component: AnalyticsHeadcount, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof AnalyticsHeadcount>;
export const Default: Story = { args: { total: 150, porTipoContrato: [{ tipo: "CLT", quantidade: 130 }, { tipo: "Estágio", quantidade: 15 }, { tipo: "Temporário", quantidade: 5 }], porDepartamento: [], porGenero: { masculino: 80, feminino: 68, outro: 2 }, porFaixaEtaria: [{ faixa: "18-25", quantidade: 25 }, { faixa: "26-35", quantidade: 60 }, { faixa: "36-45", quantidade: 40 }, { faixa: "46+", quantidade: 25 }], evolucao: [] } };
