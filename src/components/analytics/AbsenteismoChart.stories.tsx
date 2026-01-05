import type { Meta, StoryObj } from "@storybook/react";
import { AbsenteismoChart } from "./AbsenteismoChart";
const meta: Meta<typeof AbsenteismoChart> = { title: "Analytics/AbsenteismoChart", component: AbsenteismoChart };
export default meta;
type Story = StoryObj<typeof AbsenteismoChart>;
export const Default: Story = { args: { data: [{ departamento: "TI", diasPerdidos: 15, taxaAbsenteismo: 2.5, principalMotivo: "Atestado" }, { departamento: "Comercial", diasPerdidos: 25, taxaAbsenteismo: 3.8, principalMotivo: "Falta" }] } };
