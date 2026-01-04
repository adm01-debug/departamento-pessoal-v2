import type { Meta, StoryObj } from "@storybook/react";
import { TimePicker } from "@/components/ui/TimePicker";

const meta: Meta<typeof TimePicker> = {
  title: "Components/UI/TimePicker",
  component: TimePicker,
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

export const Default: Story = { args: { children: "TimePicker Default" } };
export const Primary: Story = { args: { variant: "primary", children: "TimePicker Primary" } };
export const Secondary: Story = { args: { variant: "secondary", children: "TimePicker Secondary" } };
export const Small: Story = { args: { size: "sm", children: "TimePicker Small" } };
export const Large: Story = { args: { size: "lg", children: "TimePicker Large" } };
export const Disabled: Story = { args: { disabled: true, children: "TimePicker Disabled" } };
export const Loading: Story = { args: { loading: true, children: "TimePicker Loading" } };
export const WithIcon: Story = { args: { children: "With Icon", icon: "check" } };
export const FullWidth: Story = { args: { className: "w-full", children: "Full Width" } };
export const CustomStyle: Story = { args: { className: "bg-gradient-to-r from-blue-500 to-purple-500", children: "Custom" } };
