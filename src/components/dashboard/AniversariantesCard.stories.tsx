import type { Meta, StoryObj } from "@storybook/react";
import { AniversariantesCard } from "./AniversariantesCard";
const meta: Meta<typeof AniversariantesCard> = { title: "Dashboard/AniversariantesCard", component: AniversariantesCard };
export default meta;
type Story = StoryObj<typeof AniversariantesCard>;
export const Default: Story = { args: { mes: "Janeiro", aniversariantes: [{ nome: "João Silva", data: "05/01", departamento: "TI" }, { nome: "Maria Santos", data: "15/01", departamento: "RH" }] } };
export const Empty: Story = { args: { mes: "Fevereiro", aniversariantes: [] } };
