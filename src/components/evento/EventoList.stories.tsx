import type { Meta, StoryObj } from "@storybook/react";
import { EventoList } from "./EventoList";
const meta: Meta<typeof EventoList> = { title: "Lists/EventoList", component: EventoList, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof EventoList>;
const mockEventos = [{ id: "1", rubricaNome: "Salário Base", tipo: "PROVENTO", referencia: "220", valor: 5000, origem: "CALCULADO" }, { id: "2", rubricaNome: "Hora Extra 50%", tipo: "PROVENTO", referencia: "10", valor: 340.91, origem: "CALCULADO" }, { id: "3", rubricaNome: "INSS", tipo: "DESCONTO", referencia: "", valor: 482.50, origem: "CALCULADO" }, { id: "4", rubricaNome: "IRRF", tipo: "DESCONTO", referencia: "", valor: 125.30, origem: "CALCULADO" }];
export const Default: Story = { args: { eventos: mockEventos, totalProventos: 5340.91, totalDescontos: 607.80, liquido: 4733.11 } };
export const Empty: Story = { args: { eventos: [], totalProventos: 0, totalDescontos: 0, liquido: 0 } };
