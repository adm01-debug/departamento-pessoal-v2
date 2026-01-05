import type { Meta, StoryObj } from "@storybook/react";
import { AvaliacaoList } from "./AvaliacaoList";
const meta: Meta<typeof AvaliacaoList> = { title: "Lists/AvaliacaoList", component: AvaliacaoList, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof AvaliacaoList>;
const mockAvaliacoes = [{ id: "1", ciclo: "2024-2", periodo: "Jul-Dez 2024", tipo: "180_GRAUS", notaFinal: 8.5, status: "CONCLUIDA" }, { id: "2", ciclo: "2025-1", periodo: "Jan-Jun 2025", tipo: "360_GRAUS", notaFinal: null, status: "PENDENTE" }];
export const Default: Story = { args: { avaliacoes: mockAvaliacoes } };
export const Empty: Story = { args: { avaliacoes: [] } };
