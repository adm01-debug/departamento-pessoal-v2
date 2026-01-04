import type { Meta, StoryObj } from "@storybook/react";
import { Menubar } from "./Menubar";

const meta: Meta<typeof Menubar> = {
  title: "Components/Menubar",
  component: Menubar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "Menubar" } };
export const WithVariants: Story = { args: { children: "Menubar Variant", variant: "primary" } };
export const Small: Story = { args: { children: "Menubar", size: "sm" } };
export const Large: Story = { args: { children: "Menubar", size: "lg" } };
