import type { Meta, StoryObj } from "@storybook/react";
import { SindicatoForm } from "./SindicatoForm";
const meta: Meta<typeof SindicatoForm> = { title: "Forms/SindicatoForm", component: SindicatoForm, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof SindicatoForm>;
export const Default: Story = { args: {} };
export const ComDados: Story = { args: { defaultValues: { codigo: "SIND001", nome: "Sindicato dos Comerciários", cnpj: "12345678000199", cidade: "São Paulo", uf: "SP", contribuicaoSindical: 1, contribuicaoAssistencial: 2, ativo: true } } };
