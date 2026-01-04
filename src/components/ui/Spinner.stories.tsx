import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./Spinner";

const meta: Meta<typeof Spinner> = {
  title: "Components/Spinner",
  component: Spinner,
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

export const Default: Story = { args: { children: "Spinner Component" } };
export const Primary: Story = { args: { children: "Spinner Primary", variant: "primary" } };
export const Secondary: Story = { args: { children: "Spinner Secondary", variant: "secondary" } };
export const Small: Story = { args: { children: "Spinner Small", size: "sm" } };
export const Large: Story = { args: { children: "Spinner Large", size: "lg" } };
export const Disabled: Story = { args: { children: "Spinner Disabled", disabled: true } };
export const Loading: Story = { args: { children: "Spinner Loading", loading: true } };
