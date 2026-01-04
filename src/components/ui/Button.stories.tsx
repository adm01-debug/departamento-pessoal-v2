import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
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

export const Default: Story = { args: { children: "Button Component" } };
export const Primary: Story = { args: { children: "Button Primary", variant: "primary" } };
export const Secondary: Story = { args: { children: "Button Secondary", variant: "secondary" } };
export const Small: Story = { args: { children: "Button Small", size: "sm" } };
export const Large: Story = { args: { children: "Button Large", size: "lg" } };
export const Disabled: Story = { args: { children: "Button Disabled", disabled: true } };
export const Loading: Story = { args: { children: "Button Loading", loading: true } };
