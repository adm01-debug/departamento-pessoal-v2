import type { Meta, StoryObj } from "@storybook/react";
import { EventoForm } from "./EventoForm";
const meta: Meta<typeof EventoForm> = { title: "Forms/EventoForm", component: EventoForm, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof EventoForm>;
export const Default: Story = { args: {} };
export const Provento: Story = { args: { defaultValues: { rubricaId: "1", tipo: "PROVENTO", origem: "MANUAL", valor: 500, referencia: "10" } } };
export const Desconto: Story = { args: { defaultValues: { rubricaId: "2", tipo: "DESCONTO", origem: "CALCULADO", valor: 300 } } };
