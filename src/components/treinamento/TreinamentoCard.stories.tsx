import type { Meta, StoryObj } from "@storybook/react";
import { TreinamentoCard } from "./TreinamentoCard";
const meta: Meta<typeof TreinamentoCard> = { title: "Cards/TreinamentoCard", component: TreinamentoCard, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof TreinamentoCard>;
export const Obrigatorio: Story = { args: { treinamento: { id: "1", nome: "NR-35 Trabalho em Altura", tipo: "OBRIGATORIO", cargaHoraria: 8, modalidade: "PRESENCIAL", instrutor: "João Instrutor", certificado: true, validade: 24 } } };
export const Desenvolvimento: Story = { args: { treinamento: { id: "2", nome: "Liderança Situacional", tipo: "DESENVOLVIMENTO", cargaHoraria: 16, modalidade: "HIBRIDO", fornecedor: "Empresa XYZ", certificado: true } } };
