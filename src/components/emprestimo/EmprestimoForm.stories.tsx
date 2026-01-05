import type { Meta, StoryObj } from "@storybook/react";
import { EmprestimoForm } from "./EmprestimoForm";
const meta: Meta<typeof EmprestimoForm> = { title: "Forms/EmprestimoForm", component: EmprestimoForm, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof EmprestimoForm>;
export const Default: Story = { args: {} };
export const Consignado: Story = { args: { defaultValues: { tipo: "CONSIGNADO", valorTotal: 10000, quantidadeParcelas: 24, valorParcela: 500, taxaJuros: 1.8 } } };
