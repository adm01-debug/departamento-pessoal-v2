import type { Meta, StoryObj } from "@storybook/react";
import { Radio } from "@/components/ui/Radio";

const meta: Meta<typeof Radio> = {
  title: "Components/UI/Radio",
  component: Radio,
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

export const Default: Story = { args: { children: "Radio Default" } };
export const Primary: Story = { args: { variant: "primary", children: "Radio Primary" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Radio Secondary" } };
export const Small: Story = { args: { size: "sm", children: "Radio Small" } };
export const Large: Story = { args: { size: "lg", children: "Radio Large" } };
export const Disabled: Story = { args: { disabled: true, children: "Radio Disabled" } };
export const Loading: Story = { args: { loading: true, children: "Radio Loading" } };
export const WithIcon: Story = { args: { children: "With Icon", icon: "check" } };
export const FullWidth: Story = { args: { className: "w-full", children: "Full Width" } };
export const CustomStyle: Story = { args: { className: "bg-gradient-to-r from-blue-500 to-purple-500", children: "Custom" } };
