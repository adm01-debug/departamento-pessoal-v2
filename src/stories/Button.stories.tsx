import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/ui/Button";

const meta: Meta<typeof Button> = {
  title: "Components/UI/Button",
  component: Button,
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

export const Default: Story = { args: { children: "Button Default" } };
export const Primary: Story = { args: { variant: "primary", children: "Button Primary" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Button Secondary" } };
export const Small: Story = { args: { size: "sm", children: "Button Small" } };
export const Large: Story = { args: { size: "lg", children: "Button Large" } };
export const Disabled: Story = { args: { disabled: true, children: "Button Disabled" } };
export const Loading: Story = { args: { loading: true, children: "Button Loading" } };
export const WithIcon: Story = { args: { children: "With Icon", icon: "check" } };
export const FullWidth: Story = { args: { className: "w-full", children: "Full Width" } };
export const CustomStyle: Story = { args: { className: "bg-gradient-to-r from-blue-500 to-purple-500", children: "Custom" } };
