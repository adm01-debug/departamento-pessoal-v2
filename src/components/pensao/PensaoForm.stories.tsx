import type { Meta, StoryObj } from "@storybook/react";
import { PensaoForm } from "./PensaoForm";
const meta: Meta<typeof PensaoForm> = { title: "Forms/PensaoForm", component: PensaoForm, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof PensaoForm>;
export const Default: Story = { args: {} };
export const Percentual: Story = { args: { defaultValues: { beneficiario: "Maria Souza", cpfBeneficiario: "12345678901", tipoCalculo: "PERCENTUAL", percentual: 30, baseCalculo: "LIQUIDO", numeroProcesso: "0001234-56.2023.8.26.0100", ativo: true } } };
export const ValorFixo: Story = { args: { defaultValues: { beneficiario: "João Filho", tipoCalculo: "VALOR_FIXO", valorFixo: 1500, ativo: true } } };
