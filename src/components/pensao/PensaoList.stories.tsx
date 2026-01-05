import type { Meta, StoryObj } from "@storybook/react";
import { PensaoList } from "./PensaoList";
const meta: Meta<typeof PensaoList> = { title: "Lists/PensaoList", component: PensaoList, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof PensaoList>;
const mockPensoes = [{ id: "1", beneficiario: "Maria Souza", tipoCalculo: "PERCENTUAL", percentual: 30, processo: "0001234-56.2023", ativo: true }, { id: "2", beneficiario: "João Filho", tipoCalculo: "VALOR_FIXO", valorFixo: 1500, processo: "0005678-90.2024", ativo: true }];
export const Default: Story = { args: { pensoes: mockPensoes } };
export const Empty: Story = { args: { pensoes: [] } };
