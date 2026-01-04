import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "@/components/ui/Spinner";

const meta: Meta<typeof Spinner> = {
  title: "Components/UI/Spinner",
  component: Spinner,
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

export const Default: Story = { args: { children: "Spinner Default" } };
export const Primary: Story = { args: { variant: "primary", children: "Spinner Primary" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Spinner Secondary" } };
export const Small: Story = { args: { size: "sm", children: "Spinner Small" } };
export const Large: Story = { args: { size: "lg", children: "Spinner Large" } };
export const Disabled: Story = { args: { disabled: true, children: "Spinner Disabled" } };
export const Loading: Story = { args: { loading: true, children: "Spinner Loading" } };
export const WithIcon: Story = { args: { children: "With Icon", icon: "check" } };
export const FullWidth: Story = { args: { className: "w-full", children: "Full Width" } };
export const CustomStyle: Story = { args: { className: "bg-gradient-to-r from-blue-500 to-purple-500", children: "Custom" } };
