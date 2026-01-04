import type { Meta, StoryObj } from "@storybook/react";
import { Dialog } from "@/components/ui/Dialog";

const meta: Meta<typeof Dialog> = {
  title: "Components/UI/Dialog",
  component: Dialog,
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

export const Default: Story = { args: { children: "Dialog Default" } };
export const Primary: Story = { args: { variant: "primary", children: "Dialog Primary" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Dialog Secondary" } };
export const Small: Story = { args: { size: "sm", children: "Dialog Small" } };
export const Large: Story = { args: { size: "lg", children: "Dialog Large" } };
export const Disabled: Story = { args: { disabled: true, children: "Dialog Disabled" } };
export const Loading: Story = { args: { loading: true, children: "Dialog Loading" } };
export const WithIcon: Story = { args: { children: "With Icon", icon: "check" } };
export const FullWidth: Story = { args: { className: "w-full", children: "Full Width" } };
export const CustomStyle: Story = { args: { className: "bg-gradient-to-r from-blue-500 to-purple-500", children: "Custom" } };
