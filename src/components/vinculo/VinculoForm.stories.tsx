import type { Meta, StoryObj } from "@storybook/react";
import { VinculoForm } from "./VinculoForm";
const meta: Meta<typeof VinculoForm> = { title: "Forms/VinculoForm", component: VinculoForm, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof VinculoForm>;
export const Default: Story = { args: {} };
export const CLT: Story = { args: { defaultValues: { matricula: "001234", tipoVinculo: "CLT", salarioBase: 5000 } } };
