import type { Meta, StoryObj } from "@storybook/react";
import { DocumentoCard } from "./DocumentoCard";
const meta: Meta<typeof DocumentoCard> = { title: "Cards/DocumentoCard", component: DocumentoCard, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof DocumentoCard>;
export const Valido: Story = { args: { documento: { id: "1", tipo: "CNH", numero: "00000000000", dataValidade: "2030-12-31" } } };
export const Vencido: Story = { args: { documento: { id: "2", tipo: "ASO", numero: "12345", dataValidade: "2024-01-01" } } };
