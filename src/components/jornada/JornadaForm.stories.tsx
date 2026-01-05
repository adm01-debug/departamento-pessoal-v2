import type { Meta, StoryObj } from "@storybook/react";
import { JornadaForm } from "./JornadaForm";
const meta: Meta<typeof JornadaForm> = { title: "Forms/JornadaForm", component: JornadaForm, tags: ["autodocs"], argTypes: { onSubmit: { action: "submitted" } } };
export default meta;
type Story = StoryObj<typeof JornadaForm>;
export const Default: Story = { args: {} };
export const WithData: Story = { args: { defaultValues: { codigo: "JOR001", descricao: "Jornada Comercial", horaInicio: "08:00", horaFim: "18:00", cargaHorariaDiaria: 8, tipo: "NORMAL", diasSemana: [1,2,3,4,5], ativo: true } } };
export const Loading: Story = { args: { isLoading: true } };
