import type { Meta, StoryObj } from "@storybook/react";
import { AvaliacaoForm } from "./AvaliacaoForm";
const meta: Meta<typeof AvaliacaoForm> = { title: "Forms/AvaliacaoForm", component: AvaliacaoForm, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof AvaliacaoForm>;
export const Default: Story = { args: {} };
export const ComDados: Story = { args: { defaultValues: { ciclo: "2025-1", periodo: "Jan-Jun 2025", tipo: "180_GRAUS", notaFinal: 8.5, pontosFortes: "Proatividade, trabalho em equipe", pontosDesenvolvimento: "Gestão de tempo" } } };
