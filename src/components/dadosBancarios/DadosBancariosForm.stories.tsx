import type { Meta, StoryObj } from "@storybook/react";
import { DadosBancariosForm } from "./DadosBancariosForm";
const meta: Meta<typeof DadosBancariosForm> = { title: "Forms/DadosBancariosForm", component: DadosBancariosForm, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof DadosBancariosForm>;
export const Default: Story = { args: {} };
export const Itau: Story = { args: { defaultValues: { banco: "Itaú", codigoBanco: "341", agencia: "1234", conta: "12345", tipoConta: "CORRENTE", principal: true } } };
export const ComPix: Story = { args: { defaultValues: { banco: "Nubank", codigoBanco: "260", agencia: "0001", conta: "123456", tipoConta: "CORRENTE", chavePix: "email@email.com", principal: true } } };
