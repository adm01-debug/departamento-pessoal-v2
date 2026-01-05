import type { Meta, StoryObj } from "@storybook/react";
import { DependenteList } from "./DependenteList";
const meta: Meta<typeof DependenteList> = { title: "Lists/DependenteList", component: DependenteList, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof DependenteList>;
const mockDependentes = [{ id: "1", nome: "João Filho", parentesco: "FILHO", dataNascimento: "10/05/2015", irrf: true, salarioFamilia: true }, { id: "2", nome: "Maria Cônjuge", parentesco: "CONJUGE", dataNascimento: "15/03/1985", irrf: true, planoSaude: true }];
export const Default: Story = { args: { dependentes: mockDependentes } };
export const Empty: Story = { args: { dependentes: [] } };
