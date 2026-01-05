import type { Meta, StoryObj } from "@storybook/react";
import { ContratoForm } from "./ContratoForm";
const meta: Meta<typeof ContratoForm> = { title: "Forms/ContratoForm", component: ContratoForm, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof ContratoForm>;
export const Default: Story = { args: {} };
export const Indeterminado: Story = { args: { defaultValues: { tipo: "INDETERMINADO", regimeTrabalho: "PRESENCIAL", assinado: true } } };
export const Experiencia: Story = { args: { defaultValues: { tipo: "EXPERIENCIA", dataInicio: "2025-01-01", dataFim: "2025-03-31", regimeTrabalho: "HIBRIDO" } } };
