import type { Meta, StoryObj } from "@storybook/react";
import { DemissaoForm } from "./DemissaoForm";
const meta: Meta<typeof DemissaoForm> = { title: "Forms/DemissaoForm", component: DemissaoForm, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof DemissaoForm>;
export const Default: Story = { args: {} };
export const SemJustaCausa: Story = { args: { defaultValues: { tipo: "SEM_JUSTA_CAUSA", motivo: "Redução de quadro" } } };
