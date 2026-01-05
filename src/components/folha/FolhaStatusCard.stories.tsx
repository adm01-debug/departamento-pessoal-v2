import type { Meta, StoryObj } from "@storybook/react";
import { FolhaStatusCard } from "./FolhaStatusCard";
const meta: Meta<typeof FolhaStatusCard> = { title: "Folha/FolhaStatusCard", component: FolhaStatusCard };
export default meta;
type Story = StoryObj<typeof FolhaStatusCard>;
export const Inicio: Story = { args: { status: { ponto: "pendente", lancamentos: "pendente", calculo: "pendente", conferencia: "pendente", fechamento: "pendente" } } };
export const EmAndamento: Story = { args: { status: { ponto: "ok", lancamentos: "ok", calculo: "ok", conferencia: "pendente", fechamento: "pendente" } } };
export const Completo: Story = { args: { status: { ponto: "ok", lancamentos: "ok", calculo: "ok", conferencia: "ok", fechamento: "ok" } } };
