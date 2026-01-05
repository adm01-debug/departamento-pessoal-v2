import type { Meta, StoryObj } from "@storybook/react";
import { AtividadesRecentes } from "./AtividadesRecentes";
const meta: Meta<typeof AtividadesRecentes> = { title: "Dashboard/AtividadesRecentes", component: AtividadesRecentes };
export default meta;
type Story = StoryObj<typeof AtividadesRecentes>;
export const Default: Story = { args: { atividades: [{ tipo: "admissao", descricao: "João Silva foi admitido", usuario: "Admin", data: "05/01/2025", hora: "10:30" }, { tipo: "folha", descricao: "Folha 01/2025 calculada", usuario: "Sistema", data: "05/01/2025", hora: "09:00" }] } };
