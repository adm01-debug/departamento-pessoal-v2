import type { Meta, StoryObj } from "@storybook/react";
import { DemissaoList } from "./DemissaoList";
const meta: Meta<typeof DemissaoList> = { title: "Lists/DemissaoList", component: DemissaoList, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof DemissaoList>;
const mockDemissoes = [{ id: "1", colaboradorNome: "João Silva", data: "2025-01-05", tipo: "SEM_JUSTA_CAUSA", status: "EM_PROCESSAMENTO" }];
export const Default: Story = { args: { demissoes: mockDemissoes } };
export const Empty: Story = { args: { demissoes: [] } };
