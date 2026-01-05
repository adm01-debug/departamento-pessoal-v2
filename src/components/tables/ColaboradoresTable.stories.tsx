import type { Meta, StoryObj } from "@storybook/react";
import { ColaboradoresTable } from "./ColaboradoresTable";
const meta: Meta<typeof ColaboradoresTable> = { title: "Tables/ColaboradoresTable", component: ColaboradoresTable };
export default meta;
type Story = StoryObj<typeof ColaboradoresTable>;
const mockData = [{ id: "1", nome: "João Silva", cpf: "123.456.789-00", cargo: "Desenvolvedor", departamento: "TI", status: "ATIVO" }, { id: "2", nome: "Maria Santos", cpf: "987.654.321-00", cargo: "Analista RH", departamento: "RH", status: "FERIAS" }];
export const Default: Story = { args: { data: mockData } };
export const Empty: Story = { args: { data: [] } };
