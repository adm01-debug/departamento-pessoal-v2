import type { Meta, StoryObj } from "@storybook/react";
import { AnalyticsAbsenteismo } from "./AnalyticsAbsenteismo";
const meta: Meta<typeof AnalyticsAbsenteismo> = { title: "Analytics/Absenteismo", component: AnalyticsAbsenteismo, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof AnalyticsAbsenteismo>;
export const Default: Story = { args: { taxaGeral: 4.5, porMotivo: [{ motivo: "Atestado médico", dias: 120, percentual: 60 }, { motivo: "Faltas injustificadas", dias: 40, percentual: 20 }], porDepartamento: [], custoEstimado: 45000 } };
