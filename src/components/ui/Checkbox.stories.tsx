import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
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

export const Default: Story = { args: { children: "Checkbox Component" } };
export const Primary: Story = { args: { children: "Checkbox Primary", variant: "primary" } };
export const Secondary: Story = { args: { children: "Checkbox Secondary", variant: "secondary" } };
export const Small: Story = { args: { children: "Checkbox Small", size: "sm" } };
export const Large: Story = { args: { children: "Checkbox Large", size: "lg" } };
export const Disabled: Story = { args: { children: "Checkbox Disabled", disabled: true } };
export const Loading: Story = { args: { children: "Checkbox Loading", loading: true } };
