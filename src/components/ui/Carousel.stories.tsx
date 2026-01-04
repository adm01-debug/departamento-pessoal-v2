import type { Meta, StoryObj } from "@storybook/react";
import { Carousel } from "./Carousel";

const meta: Meta<typeof Carousel> = {
  title: "Components/Carousel",
  component: Carousel,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "Carousel" } };
export const WithVariants: Story = { args: { children: "Carousel Variant", variant: "primary" } };
export const Small: Story = { args: { children: "Carousel", size: "sm" } };
export const Large: Story = { args: { children: "Carousel", size: "lg" } };
