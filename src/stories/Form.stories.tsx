import type { Meta, StoryObj } from "@storybook/react";
import { Form } from "@/components/ui/Form";

const meta: Meta<typeof Form> = {
  title: "Components/UI/Form",
  component: Form,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "primary", "secondary", "outline"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "Form Default" } };
export const Primary: Story = { args: { variant: "primary", children: "Form Primary" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Form Secondary" } };
export const Small: Story = { args: { size: "sm", children: "Form Small" } };
export const Large: Story = { args: { size: "lg", children: "Form Large" } };
export const Disabled: Story = { args: { disabled: true, children: "Form Disabled" } };
export const Loading: Story = { args: { loading: true, children: "Form Loading" } };
export const WithIcon: Story = { args: { children: "With Icon", icon: "check" } };
export const FullWidth: Story = { args: { className: "w-full", children: "Full Width" } };
export const CustomStyle: Story = { args: { className: "bg-gradient-to-r from-blue-500 to-purple-500", children: "Custom" } };
