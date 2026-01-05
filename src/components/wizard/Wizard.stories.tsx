import type { Meta, StoryObj } from "@storybook/react";
import { Wizard } from "./Wizard";
const meta: Meta<typeof Wizard> = { title: "Wizard/Wizard", component: Wizard };
export default meta;
type Story = StoryObj<typeof Wizard>;
const steps = [{ title: "Passo 1", component: <div>Conteúdo passo 1</div>, isValid: true }, { title: "Passo 2", component: <div>Conteúdo passo 2</div>, isValid: true }, { title: "Confirmação", component: <div>Confirmar</div>, isValid: true }];
export const Default: Story = { args: { steps, onComplete: () => alert("Completo!"), title: "Assistente" } };
