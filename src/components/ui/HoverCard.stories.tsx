import type { Meta, StoryObj } from "@storybook/react";
import { HoverCard } from "./HoverCard";

const meta: Meta<typeof HoverCard> = {
  title: "Components/HoverCard",
  component: HoverCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "HoverCard" } };
export const WithVariants: Story = { args: { children: "HoverCard Variant", variant: "primary" } };
export const Small: Story = { args: { children: "HoverCard", size: "sm" } };
export const Large: Story = { args: { children: "HoverCard", size: "lg" } };
