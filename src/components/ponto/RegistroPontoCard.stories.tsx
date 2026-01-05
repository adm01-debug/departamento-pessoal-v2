import type { Meta, StoryObj } from "@storybook/react";
import { RegistroPontoCard } from "./RegistroPontoCard";
const meta: Meta<typeof RegistroPontoCard> = { title: "Cards/RegistroPontoCard", component: RegistroPontoCard };
export default meta;
type Story = StoryObj<typeof RegistroPontoCard>;
export const Normal: Story = { args: { registro: { data: "05/01/2025", diaSemana: "DOM", entrada1: "08:00", saida1: "12:00", entrada2: "13:00", saida2: "17:00", horasTrabalhadas: "08:00", status: "OK" } } };
export const ComHE: Story = { args: { registro: { data: "04/01/2025", diaSemana: "SAB", entrada1: "08:00", saida1: "12:00", entrada2: "13:00", saida2: "19:00", horasTrabalhadas: "10:00", horasExtras: "02:00", status: "OK" } } };
export const Inconsistencia: Story = { args: { registro: { data: "03/01/2025", diaSemana: "SEX", entrada1: "08:00", saida1: undefined, entrada2: undefined, saida2: undefined, horasTrabalhadas: "00:00", status: "INCONSISTENCIA" } } };
