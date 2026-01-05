import type { Meta, StoryObj } from "@storybook/react";
import { ESocialPendentes } from "./ESocialPendentes";
const meta: Meta<typeof ESocialPendentes> = { title: "ESocial/ESocialPendentes", component: ESocialPendentes };
export default meta;
type Story = StoryObj<typeof ESocialPendentes>;
export const Default: Story = { args: { eventos: [{ id: "1", tipo: "S-2200", colaborador: "João Silva", dataGeracao: "05/01/2025", status: "pendente" }, { id: "2", tipo: "S-1200", dataGeracao: "05/01/2025", status: "erro", erroMsg: "CPF inválido" }] } };
export const Empty: Story = { args: { eventos: [] } };
