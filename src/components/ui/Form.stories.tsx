import type { Meta, StoryObj } from "@storybook/react";
import { Form } from "./Form";

const meta: Meta<typeof Form> = {
  title: "Components/Form",
  component: Form,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "Form" } };
export const WithVariants: Story = { args: { children: "Form Variant", variant: "primary" } };
export const Small: Story = { args: { children: "Form", size: "sm" } };
export const Large: Story = { args: { children: "Form", size: "lg" } };
