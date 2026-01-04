import type { Meta, StoryObj } from "@storybook/react";
import { Dropdown } from "./Dropdown";

const meta: Meta<typeof Dropdown> = {
  title: "Components/Dropdown",
  component: Dropdown,
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

export const Default: Story = { args: { children: "Dropdown Component" } };
export const Primary: Story = { args: { children: "Dropdown Primary", variant: "primary" } };
export const Secondary: Story = { args: { children: "Dropdown Secondary", variant: "secondary" } };
export const Small: Story = { args: { children: "Dropdown Small", size: "sm" } };
export const Large: Story = { args: { children: "Dropdown Large", size: "lg" } };
export const Disabled: Story = { args: { children: "Dropdown Disabled", disabled: true } };
export const Loading: Story = { args: { children: "Dropdown Loading", loading: true } };
