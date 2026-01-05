import type { Meta, StoryObj } from "@storybook/react";
import { QuickStats } from "./QuickStats";
const meta: Meta<typeof QuickStats> = { title: "Dashboard/QuickStats", component: QuickStats };
export default meta;
type Story = StoryObj<typeof QuickStats>;
export const Default: Story = { args: { stats: { colaboradores: 150, custoFolha: 1500000, feriasVencidas: 5, horasExtras: 450, admissoesMes: 8, demissoesMes: 3 } } };
