import type { Meta, StoryObj } from "@storybook/react";
import { AfastamentoForm } from "./AfastamentoForm";
const meta: Meta<typeof AfastamentoForm> = { title: "Forms/AfastamentoForm", component: AfastamentoForm, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof AfastamentoForm>;
export const Default: Story = { args: {} };
export const Doenca: Story = { args: { defaultValues: { tipo: "DOENCA", dataInicio: "2025-01-10", dataFim: "2025-01-15", dias: 5, cid: "J11", crm: "12345-SP", inss: false } } };
export const AcidenteTrabalho: Story = { args: { defaultValues: { tipo: "ACIDENTE_TRABALHO", dataInicio: "2025-01-05", dataFim: "2025-02-05", dias: 30, cid: "S62.0", crm: "54321-SP", inss: true } } };
export const Maternidade: Story = { args: { defaultValues: { tipo: "MATERNIDADE", dataInicio: "2025-02-01", dataFim: "2025-05-31", dias: 120, inss: true } } };
