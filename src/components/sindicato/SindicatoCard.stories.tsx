import type { Meta, StoryObj } from "@storybook/react";
import { SindicatoCard } from "./SindicatoCard";
const meta: Meta<typeof SindicatoCard> = { title: "Cards/SindicatoCard", component: SindicatoCard, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof SindicatoCard>;
export const Ativo: Story = { args: { sindicato: { id: "1", codigo: "SIND001", nome: "Sindicato dos Comerciários", telefone: "(11) 3333-4444", email: "contato@sindicato.org.br", ativo: true } } };
export const Inativo: Story = { args: { sindicato: { id: "2", codigo: "SIND002", nome: "Sindicato Antigo", ativo: false } } };
