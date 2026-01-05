import type { Meta, StoryObj } from "@storybook/react";
import { AvaliacaoCard } from "./AvaliacaoCard";
const meta: Meta<typeof AvaliacaoCard> = { title: "Cards/AvaliacaoCard", component: AvaliacaoCard, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof AvaliacaoCard>;
export const Concluida: Story = { args: { avaliacao: { id: "1", ciclo: "2024-2", periodo: "Jul-Dez 2024", tipo: "180_GRAUS", notaFinal: 8.5, status: "CONCLUIDA", pontosFortes: "Excelente comunicação e trabalho em equipe" } } };
export const Pendente: Story = { args: { avaliacao: { id: "2", ciclo: "2025-1", periodo: "Jan-Jun 2025", tipo: "360_GRAUS", status: "PENDENTE" } } };
export const EmAndamento: Story = { args: { avaliacao: { id: "3", ciclo: "2025-1", periodo: "Jan-Jun 2025", tipo: "AUTOAVALIACAO", status: "EM_ANDAMENTO" } } };
