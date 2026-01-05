import type { Meta, StoryObj } from "@storybook/react";
import { DocumentoForm } from "./DocumentoForm";
const meta: Meta<typeof DocumentoForm> = { title: "Forms/DocumentoForm", component: DocumentoForm, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof DocumentoForm>;
export const Default: Story = { args: {} };
export const RG: Story = { args: { defaultValues: { tipo: "RG", numero: "00.000.000-0", orgaoEmissor: "SSP", uf: "SP" } } };
export const CNH: Story = { args: { defaultValues: { tipo: "CNH", numero: "00000000000", dataValidade: "2030-12-31" } } };
