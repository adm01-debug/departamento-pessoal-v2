import type { Meta, StoryObj } from "@storybook/react";
import { ExameForm } from "./ExameForm";
const meta: Meta<typeof ExameForm> = { title: "Forms/ExameForm", component: ExameForm, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof ExameForm>;
export const Default: Story = { args: {} };
export const Admissional: Story = { args: { defaultValues: { tipo: "ADMISSIONAL", resultado: "APTO", medico: "Dr. João Silva", crm: "12345-SP" } } };
export const Periodico: Story = { args: { defaultValues: { tipo: "PERIODICO", resultado: "APTO_RESTRICOES", dataValidade: "2026-01-01" } } };
