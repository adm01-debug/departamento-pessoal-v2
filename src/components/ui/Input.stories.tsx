import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "primary", "secondary", "outline"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "Input Component" } };
export const Primary: Story = { args: { children: "Input Primary", variant: "primary" } };
export const Secondary: Story = { args: { children: "Input Secondary", variant: "secondary" } };
export const Small: Story = { args: { children: "Input Small", size: "sm" } };
export const Large: Story = { args: { children: "Input Large", size: "lg" } };
export const Disabled: Story = { args: { children: "Input Disabled", disabled: true } };
export const Loading: Story = { args: { children: "Input Loading", loading: true } };
