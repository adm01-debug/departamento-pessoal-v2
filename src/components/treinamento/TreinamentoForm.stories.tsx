import type { Meta, StoryObj } from "@storybook/react";
import { TreinamentoForm } from "./TreinamentoForm";
const meta: Meta<typeof TreinamentoForm> = { title: "Forms/TreinamentoForm", component: TreinamentoForm, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof TreinamentoForm>;
export const Default: Story = { args: {} };
export const NRObrigatorio: Story = { args: { defaultValues: { nome: "NR-35 Trabalho em Altura", tipo: "OBRIGATORIO", cargaHoraria: 8, modalidade: "PRESENCIAL", certificado: true, validade: 24 } } };
export const Online: Story = { args: { defaultValues: { nome: "Excel Avançado", tipo: "DESENVOLVIMENTO", cargaHoraria: 20, modalidade: "ONLINE", certificado: true } } };
