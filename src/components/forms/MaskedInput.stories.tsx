import type { Meta, StoryObj } from "@storybook/react";
import { MaskedInput } from "./MaskedInput";
const meta: Meta<typeof MaskedInput> = { title: "Forms/MaskedInput", component: MaskedInput };
export default meta;
type Story = StoryObj<typeof MaskedInput>;
export const CPF: Story = { args: { mask: "cpf", placeholder: "000.000.000-00" } };
export const CNPJ: Story = { args: { mask: "cnpj", placeholder: "00.000.000/0000-00" } };
export const Telefone: Story = { args: { mask: "telefone", placeholder: "(00) 00000-0000" } };
export const CEP: Story = { args: { mask: "cep", placeholder: "00000-000" } };
