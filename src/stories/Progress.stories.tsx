import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "@/components/ui/Progress";

const meta: Meta<typeof Progress> = {
  title: "Components/UI/Progress",
  component: Progress,
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

export const Default: Story = { args: { children: "Progress Default" } };
export const Primary: Story = { args: { variant: "primary", children: "Progress Primary" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Progress Secondary" } };
export const Small: Story = { args: { size: "sm", children: "Progress Small" } };
export const Large: Story = { args: { size: "lg", children: "Progress Large" } };
export const Disabled: Story = { args: { disabled: true, children: "Progress Disabled" } };
export const Loading: Story = { args: { loading: true, children: "Progress Loading" } };
export const WithIcon: Story = { args: { children: "With Icon", icon: "check" } };
export const FullWidth: Story = { args: { className: "w-full", children: "Full Width" } };
export const CustomStyle: Story = { args: { className: "bg-gradient-to-r from-blue-500 to-purple-500", children: "Custom" } };
