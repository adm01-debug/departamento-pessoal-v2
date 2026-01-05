import type { Meta, StoryObj } from "@storybook/react";
import { FeriasWizard } from "./FeriasWizard";
const meta: Meta<typeof FeriasWizard> = { title: "Wizard/FeriasWizard", component: FeriasWizard };
export default meta;
type Story = StoryObj<typeof FeriasWizard>;
export const Default: Story = { args: { colaborador: { id: "1", nome: "João Silva", diasDisponiveis: 30, periodoAquisitivo: "2023/2024" }, onComplete: data => console.log("Completo:", data) } };
