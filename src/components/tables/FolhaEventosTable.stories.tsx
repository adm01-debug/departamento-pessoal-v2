import type { Meta, StoryObj } from "@storybook/react";
import { FolhaEventosTable } from "./FolhaEventosTable";
const meta: Meta<typeof FolhaEventosTable> = { title: "Tables/FolhaEventosTable", component: FolhaEventosTable };
export default meta;
type Story = StoryObj<typeof FolhaEventosTable>;
const mockData = [{ id: "1", colaborador: "João Silva", rubrica: "Salário Base", tipo: "PROVENTO" as const, valor: 5000 }, { id: "2", colaborador: "João Silva", rubrica: "INSS", tipo: "DESCONTO" as const, valor: 400 }];
export const Default: Story = { args: { data: mockData } };
