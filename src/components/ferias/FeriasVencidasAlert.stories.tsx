import type { Meta, StoryObj } from "@storybook/react";
import { FeriasVencidasAlert } from "./FeriasVencidasAlert";
const meta: Meta<typeof FeriasVencidasAlert> = { title: "Ferias/FeriasVencidasAlert", component: FeriasVencidasAlert };
export default meta;
type Story = StoryObj<typeof FeriasVencidasAlert>;
export const Default: Story = { args: { ferias: [{ colaboradorNome: "João Silva", dataVencimento: "01/12/2024", diasVencidos: 35 }, { colaboradorNome: "Maria Santos", dataVencimento: "15/11/2024", diasVencidos: 51 }] } };
export const Empty: Story = { args: { ferias: [] } };
