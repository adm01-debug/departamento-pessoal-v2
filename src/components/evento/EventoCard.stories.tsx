import type { Meta, StoryObj } from "@storybook/react";
import { EventoCard } from "./EventoCard";
const meta: Meta<typeof EventoCard> = { title: "Cards/EventoCard", component: EventoCard, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof EventoCard>;
export const Provento: Story = { args: { evento: { id: "1", rubricaNome: "Salário Base", tipo: "PROVENTO", origem: "CALCULADO", valor: 5000 } } };
export const Desconto: Story = { args: { evento: { id: "2", rubricaNome: "INSS", tipo: "DESCONTO", origem: "CALCULADO", valor: 482.50 } } };
export const Informativo: Story = { args: { evento: { id: "3", rubricaNome: "Base FGTS", tipo: "INFORMATIVO", origem: "CALCULADO", valor: 5340.91 } } };
