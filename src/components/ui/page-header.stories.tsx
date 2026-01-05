import type { Meta, StoryObj } from "@storybook/react";
import { PageHeader } from "./page-header";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
const meta: Meta<typeof PageHeader> = { title: "UI/PageHeader", component: PageHeader };
export default meta;
type Story = StoryObj<typeof PageHeader>;
export const Default: Story = { args: { title: "Colaboradores", description: "Gestão de colaboradores" } };
export const WithActions: Story = { args: { title: "Folha de Pagamento", description: "Competência 01/2025", children: <><Button variant="outline"><Download className="h-4 w-4 mr-2" />Exportar</Button><Button><Plus className="h-4 w-4 mr-2" />Novo</Button></> } };
