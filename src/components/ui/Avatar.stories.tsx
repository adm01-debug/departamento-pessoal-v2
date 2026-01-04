import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./Avatar";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "Avatar" } };
export const WithVariants: Story = { args: { children: "Avatar Variant", variant: "primary" } };
export const Small: Story = { args: { children: "Avatar", size: "sm" } };
export const Large: Story = { args: { children: "Avatar", size: "lg" } };
