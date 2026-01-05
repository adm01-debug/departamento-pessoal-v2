import type { Meta, StoryObj } from "@storybook/react";
import { ExameList } from "./ExameList";
const meta: Meta<typeof ExameList> = { title: "Lists/ExameList", component: ExameList, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof ExameList>;
const mockExames = [{ id: "1", tipo: "ADMISSIONAL", dataExame: "01/03/2023", dataValidade: "01/03/2024", resultado: "APTO", medico: "Dr. João" }, { id: "2", tipo: "PERIODICO", dataExame: "01/01/2025", dataValidade: "01/01/2026", resultado: "APTO", medico: "Dra. Maria" }];
export const Default: Story = { args: { exames: mockExames } };
export const ComVencido: Story = { args: { exames: [...mockExames, { id: "3", tipo: "PERIODICO", dataExame: "01/01/2023", dataValidade: "01/01/2024", resultado: "APTO" }] } };
