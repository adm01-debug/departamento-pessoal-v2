import type { Meta, StoryObj } from "@storybook/react";
import { DependenteCard } from "./DependenteCard";
const meta: Meta<typeof DependenteCard> = { title: "Cards/DependenteCard", component: DependenteCard, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof DependenteCard>;
export const Filho: Story = { args: { dependente: { id: "1", nome: "João Filho", parentesco: "FILHO", dataNascimento: "10/05/2015", irrf: true, salarioFamilia: true, planoSaude: false, invalidez: false } } };
export const ComInvalidez: Story = { args: { dependente: { id: "2", nome: "Pedro Especial", parentesco: "FILHO", dataNascimento: "20/08/2010", irrf: true, salarioFamilia: true, planoSaude: true, invalidez: true } } };
