import type { Meta, StoryObj } from "@storybook/react";
import { TreinamentoList } from "./TreinamentoList";
const meta: Meta<typeof TreinamentoList> = { title: "Lists/TreinamentoList", component: TreinamentoList, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof TreinamentoList>;
const mockTreinamentos = [{ id: "1", nome: "NR-35 Trabalho em Altura", tipo: "OBRIGATORIO", cargaHoraria: 8, modalidade: "PRESENCIAL", certificado: true, ativo: true }, { id: "2", nome: "Excel Avançado", tipo: "DESENVOLVIMENTO", cargaHoraria: 20, modalidade: "ONLINE", certificado: true, ativo: true }];
export const Default: Story = { args: { treinamentos: mockTreinamentos } };
export const Empty: Story = { args: { treinamentos: [] } };
