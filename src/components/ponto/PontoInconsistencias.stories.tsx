import type { Meta, StoryObj } from "@storybook/react";
import { PontoInconsistencias } from "./PontoInconsistencias";
const meta: Meta<typeof PontoInconsistencias> = { title: "Ponto/PontoInconsistencias", component: PontoInconsistencias };
export default meta;
type Story = StoryObj<typeof PontoInconsistencias>;
export const Default: Story = { args: { inconsistencias: [{ id: "1", colaborador: "João Silva", data: "03/01/2025", tipo: "Falta marcação", descricao: "Saída não registrada", status: "pendente" }, { id: "2", colaborador: "Maria Santos", data: "04/01/2025", tipo: "HE não autorizada", descricao: "2h extras sem aprovação", status: "pendente" }] } };
export const Resolvido: Story = { args: { inconsistencias: [] } };
