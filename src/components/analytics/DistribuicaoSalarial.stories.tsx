import type { Meta, StoryObj } from "@storybook/react";
import { DistribuicaoSalarial } from "./DistribuicaoSalarial";
const meta: Meta<typeof DistribuicaoSalarial> = { title: "Analytics/DistribuicaoSalarial", component: DistribuicaoSalarial };
export default meta;
type Story = StoryObj<typeof DistribuicaoSalarial>;
export const Default: Story = { args: { data: [{ faixa: "Até 3k", quantidade: 30, percentual: 20 }, { faixa: "3k-6k", quantidade: 60, percentual: 40 }, { faixa: "6k-10k", quantidade: 45, percentual: 30 }, { faixa: "Acima 10k", quantidade: 15, percentual: 10 }] } };
