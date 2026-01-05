import type { Meta, StoryObj } from "@storybook/react";
import { PasswordInput } from "./PasswordInput";
const meta: Meta<typeof PasswordInput> = { title: "Forms/PasswordInput", component: PasswordInput };
export default meta;
type Story = StoryObj<typeof PasswordInput>;
export const Default: Story = { args: { placeholder: "Senha" } };
export const WithStrength: Story = { args: { showStrength: true, value: "Abc123!@" } };
export const Weak: Story = { args: { showStrength: true, value: "123" } };
