import type { Meta, StoryObj } from "@storybook/react";
import { ContratoCard } from "./ContratoCard";
const meta: Meta<typeof ContratoCard> = { title: "Cards/ContratoCard", component: ContratoCard, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof ContratoCard>;
export const Ativo: Story = { args: { contrato: { id: "1", numero: "CT-001", tipo: "INDETERMINADO", dataInicio: "01/03/2023", regimeTrabalho: "PRESENCIAL", assinado: true, ativo: true } } };
export const PendenteAssinatura: Story = { args: { contrato: { id: "2", tipo: "EXPERIENCIA", dataInicio: "01/01/2025", regimeTrabalho: "REMOTO", assinado: false, ativo: true } } };
