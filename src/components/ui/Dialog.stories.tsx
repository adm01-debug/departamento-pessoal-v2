import type { Meta, StoryObj } from "@storybook/react";
import { Dialog } from "./Dialog";

const meta: Meta<typeof Dialog> = {
  title: "Components/Dialog",
  component: Dialog,
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

export const Default: Story = { args: { children: "Dialog Component" } };
export const Primary: Story = { args: { children: "Dialog Primary", variant: "primary" } };
export const Secondary: Story = { args: { children: "Dialog Secondary", variant: "secondary" } };
export const Small: Story = { args: { children: "Dialog Small", size: "sm" } };
export const Large: Story = { args: { children: "Dialog Large", size: "lg" } };
export const Disabled: Story = { args: { children: "Dialog Disabled", disabled: true } };
export const Loading: Story = { args: { children: "Dialog Loading", loading: true } };
