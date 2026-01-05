import type { Meta, StoryObj } from "@storybook/react";
import { DependenteForm } from "./DependenteForm";
const meta: Meta<typeof DependenteForm> = { title: "Forms/DependenteForm", component: DependenteForm, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof DependenteForm>;
export const Default: Story = { args: {} };
export const Filho: Story = { args: { defaultValues: { nome: "João Filho", parentesco: "FILHO", dataNascimento: "2015-05-10", irrf: true, salarioFamilia: true } } };
export const Conjuge: Story = { args: { defaultValues: { nome: "Maria Silva", parentesco: "CONJUGE", dataNascimento: "1985-03-15", irrf: true, planoSaude: true } } };
