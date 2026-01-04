import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "./Breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "Breadcrumb" } };
export const WithVariants: Story = { args: { children: "Breadcrumb Variant", variant: "primary" } };
export const Small: Story = { args: { children: "Breadcrumb", size: "sm" } };
export const Large: Story = { args: { children: "Breadcrumb", size: "lg" } };
