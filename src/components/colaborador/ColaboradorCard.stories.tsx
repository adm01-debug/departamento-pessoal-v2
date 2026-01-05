import type { Meta, StoryObj } from "@storybook/react";
import { ColaboradorCard } from "./ColaboradorCard";
const meta: Meta<typeof ColaboradorCard> = { title: "Cards/ColaboradorCard", component: ColaboradorCard };
export default meta;
type Story = StoryObj<typeof ColaboradorCard>;
export const Ativo: Story = { args: { colaborador: { id: "1", nome: "João Silva", cpf: "123.456.789-00", cargo: "Desenvolvedor", departamento: "TI", dataAdmissao: "01/03/2023", salario: 5000, status: "ATIVO", email: "joao@empresa.com" } } };
export const Ferias: Story = { args: { colaborador: { id: "2", nome: "Maria Santos", cpf: "987.654.321-00", cargo: "Analista RH", departamento: "RH", dataAdmissao: "15/06/2022", salario: 4500, status: "FERIAS" } } };
