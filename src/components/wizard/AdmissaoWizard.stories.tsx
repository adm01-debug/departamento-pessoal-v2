import type { Meta, StoryObj } from "@storybook/react";
import { AdmissaoWizard } from "./AdmissaoWizard";
const meta: Meta<typeof AdmissaoWizard> = { title: "Wizard/AdmissaoWizard", component: AdmissaoWizard };
export default meta;
type Story = StoryObj<typeof AdmissaoWizard>;
export const Default: Story = { args: { onComplete: data => console.log("Completo:", data), onCancel: () => console.log("Cancelado") } };
