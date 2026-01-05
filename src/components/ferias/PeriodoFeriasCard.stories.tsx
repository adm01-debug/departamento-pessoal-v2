import type { Meta, StoryObj } from "@storybook/react";
import { PeriodoFeriasCard } from "./PeriodoFeriasCard";
const meta: Meta<typeof PeriodoFeriasCard> = { title: "Cards/PeriodoFeriasCard", component: PeriodoFeriasCard };
export default meta;
type Story = StoryObj<typeof PeriodoFeriasCard>;
export const Disponivel: Story = { args: { periodo: { periodoAquisitivo: "2023/2024", dataLimite: "01/03/2025", diasDisponiveis: 30, diasUsados: 0, vencido: false } } };
export const Parcial: Story = { args: { periodo: { periodoAquisitivo: "2022/2023", dataLimite: "01/03/2024", diasDisponiveis: 10, diasUsados: 20, vencido: false } } };
export const Vencido: Story = { args: { periodo: { periodoAquisitivo: "2021/2022", dataLimite: "01/03/2023", diasDisponiveis: 30, diasUsados: 0, vencido: true } } };
