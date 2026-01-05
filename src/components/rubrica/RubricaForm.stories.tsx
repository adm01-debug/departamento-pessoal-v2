import type { Meta, StoryObj } from "@storybook/react";
import { RubricaForm } from "./RubricaForm";
const meta: Meta<typeof RubricaForm> = { title: "Forms/RubricaForm", component: RubricaForm, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof RubricaForm>;
export const Default: Story = { args: {} };
export const Provento: Story = { args: { defaultValues: { codigo: "1000", descricao: "Salário Base", tipo: "PROVENTO", natureza: "SALARIO", incideINSS: true, incideIRRF: true, incideFGTS: true } } };
export const Desconto: Story = { args: { defaultValues: { codigo: "9001", descricao: "INSS", tipo: "DESCONTO", natureza: "CONTRIBUICAO", incideINSS: false } } };
