import type { Meta, StoryObj } from "@storybook/react";
import { ExameCard } from "./ExameCard";
const meta: Meta<typeof ExameCard> = { title: "Cards/ExameCard", component: ExameCard, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof ExameCard>;
export const Apto: Story = { args: { exame: { id: "1", tipo: "ADMISSIONAL", dataExame: "01/03/2023", resultado: "APTO", medico: "Dr. João", crm: "12345-SP" } } };
export const AptoRestricoes: Story = { args: { exame: { id: "2", tipo: "PERIODICO", dataExame: "01/01/2025", dataValidade: "01/01/2026", resultado: "APTO_RESTRICOES" } } };
export const Vencido: Story = { args: { exame: { id: "3", tipo: "PERIODICO", dataExame: "01/01/2023", dataValidade: "01/01/2024", resultado: "APTO" } } };
