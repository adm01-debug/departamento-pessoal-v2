import type { Meta, StoryObj } from "@storybook/react";
import { AlertasPanel } from "./AlertasPanel";
const meta: Meta<typeof AlertasPanel> = { title: "Dashboard/AlertasPanel", component: AlertasPanel };
export default meta;
type Story = StoryObj<typeof AlertasPanel>;
export const Default: Story = { args: { alertas: [{ tipo: "vencimento", titulo: "ASOs Vencendo", descricao: "5 colaboradores com ASO vencendo", data: "10/01/2025" }, { tipo: "pendencia", titulo: "Férias Vencidas", descricao: "3 colaboradores com férias vencidas" }] } };
export const Empty: Story = { args: { alertas: [] } };
