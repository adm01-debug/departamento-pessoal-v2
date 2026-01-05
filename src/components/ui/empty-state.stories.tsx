import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./empty-state";
import { Button } from "@/components/ui/button";
import { FileX, Plus } from "lucide-react";
const meta: Meta<typeof EmptyState> = { title: "UI/EmptyState", component: EmptyState };
export default meta;
type Story = StoryObj<typeof EmptyState>;
export const Default: Story = { args: { icon: <FileX className="h-12 w-12" />, title: "Nenhum registro encontrado", description: "Não há dados para exibir" } };
export const WithAction: Story = { args: { icon: <FileX className="h-12 w-12" />, title: "Nenhum colaborador", description: "Adicione seu primeiro colaborador", action: <Button><Plus className="h-4 w-4 mr-2" />Adicionar</Button> } };
