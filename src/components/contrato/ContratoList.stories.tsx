import type { Meta, StoryObj } from "@storybook/react";
import { ContratoList } from "./ContratoList";
const meta: Meta<typeof ContratoList> = { title: "Lists/ContratoList", component: ContratoList, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof ContratoList>;
const mockContratos = [{ id: "1", numero: "CT-001", tipo: "INDETERMINADO", dataInicio: "01/03/2023", regimeTrabalho: "PRESENCIAL", assinado: true, ativo: true }, { id: "2", numero: "CT-002", tipo: "EXPERIENCIA", dataInicio: "01/01/2025", regimeTrabalho: "HIBRIDO", assinado: false, ativo: true }];
export const Default: Story = { args: { contratos: mockContratos } };
export const Empty: Story = { args: { contratos: [] } };
