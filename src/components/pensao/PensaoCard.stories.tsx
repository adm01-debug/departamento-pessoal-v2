import type { Meta, StoryObj } from "@storybook/react";
import { PensaoCard } from "./PensaoCard";
const meta: Meta<typeof PensaoCard> = { title: "Cards/PensaoCard", component: PensaoCard, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof PensaoCard>;
export const Percentual: Story = { args: { pensao: { id: "1", beneficiario: "Maria Souza", tipoCalculo: "PERCENTUAL", percentual: 30, processo: "0001234-56.2023", ativo: true } } };
export const ValorFixo: Story = { args: { pensao: { id: "2", beneficiario: "João Filho", tipoCalculo: "VALOR_FIXO", valorFixo: 1500, processo: "0005678-90.2024", ativo: true } } };
export const Inativa: Story = { args: { pensao: { id: "3", beneficiario: "Antigo", tipoCalculo: "PERCENTUAL", percentual: 20, ativo: false } } };
