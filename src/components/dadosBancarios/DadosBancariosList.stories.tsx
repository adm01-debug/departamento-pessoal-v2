import type { Meta, StoryObj } from "@storybook/react";
import { DadosBancariosList } from "./DadosBancariosList";
const meta: Meta<typeof DadosBancariosList> = { title: "Lists/DadosBancariosList", component: DadosBancariosList, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof DadosBancariosList>;
const mockContas = [{ id: "1", banco: "Itaú", codigoBanco: "341", agencia: "1234", conta: "12345-6", tipoConta: "CORRENTE", principal: true, chavePix: null }, { id: "2", banco: "Nubank", codigoBanco: "260", agencia: "0001", conta: "123456-7", tipoConta: "CORRENTE", principal: false, chavePix: "email@test.com" }];
export const Default: Story = { args: { contas: mockContas } };
export const Empty: Story = { args: { contas: [] } };
