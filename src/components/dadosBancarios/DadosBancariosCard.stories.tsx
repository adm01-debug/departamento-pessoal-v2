import type { Meta, StoryObj } from "@storybook/react";
import { DadosBancariosCard } from "./DadosBancariosCard";
const meta: Meta<typeof DadosBancariosCard> = { title: "Cards/DadosBancariosCard", component: DadosBancariosCard, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof DadosBancariosCard>;
export const Principal: Story = { args: { conta: { id: "1", banco: "Itaú", agencia: "1234", conta: "12345-6", tipoConta: "CORRENTE", principal: true } } };
export const ComPix: Story = { args: { conta: { id: "2", banco: "Nubank", agencia: "0001", conta: "123456-7", tipoConta: "CORRENTE", principal: false, chavePix: "email@test.com" } } };
