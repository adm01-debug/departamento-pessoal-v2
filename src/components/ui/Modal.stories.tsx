import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./Modal";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
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

export const Default: Story = { args: { children: "Modal Component" } };
export const Primary: Story = { args: { children: "Modal Primary", variant: "primary" } };
export const Secondary: Story = { args: { children: "Modal Secondary", variant: "secondary" } };
export const Small: Story = { args: { children: "Modal Small", size: "sm" } };
export const Large: Story = { args: { children: "Modal Large", size: "lg" } };
export const Disabled: Story = { args: { children: "Modal Disabled", disabled: true } };
export const Loading: Story = { args: { children: "Modal Loading", loading: true } };
