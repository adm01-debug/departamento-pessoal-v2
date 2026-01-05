import type { Meta, StoryObj } from "@storybook/react";
import { ResumoFolhaCard } from "./ResumoFolhaCard";
const meta: Meta<typeof ResumoFolhaCard> = { title: "Cards/ResumoFolhaCard", component: ResumoFolhaCard };
export default meta;
type Story = StoryObj<typeof ResumoFolhaCard>;
export const Default: Story = { args: { resumo: { competencia: "01/2025", totalProventos: 850000, totalDescontos: 150000, totalLiquido: 700000, colaboradores: 150, status: "ABERTA" } } };
export const Fechada: Story = { args: { resumo: { competencia: "12/2024", totalProventos: 820000, totalDescontos: 145000, totalLiquido: 675000, colaboradores: 148, status: "FECHADA" }, mesAnterior: { totalLiquido: 660000 } } };
