import type { Meta, StoryObj } from "@storybook/react";
import { TurnoverChart } from "./TurnoverChart";
const meta: Meta<typeof TurnoverChart> = { title: "Analytics/TurnoverChart", component: TurnoverChart };
export default meta;
type Story = StoryObj<typeof TurnoverChart>;
export const Default: Story = { args: { data: [{ periodo: "Jul/24", admissoes: 5, demissoes: 3, taxa: 2.1 }, { periodo: "Ago/24", admissoes: 4, demissoes: 2, taxa: 1.8 }, { periodo: "Set/24", admissoes: 6, demissoes: 4, taxa: 2.5 }, { periodo: "Out/24", admissoes: 3, demissoes: 5, taxa: 3.2 }, { periodo: "Nov/24", admissoes: 7, demissoes: 2, taxa: 1.5 }, { periodo: "Dez/24", admissoes: 2, demissoes: 3, taxa: 2.0 }] } };
