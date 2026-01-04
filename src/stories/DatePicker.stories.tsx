import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "@/components/ui/DatePicker";

const meta: Meta<typeof DatePicker> = {
  title: "Components/UI/DatePicker",
  component: DatePicker,
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

export const Default: Story = { args: { children: "DatePicker Default" } };
export const Primary: Story = { args: { variant: "primary", children: "DatePicker Primary" } };
export const Secondary: Story = { args: { variant: "secondary", children: "DatePicker Secondary" } };
export const Small: Story = { args: { size: "sm", children: "DatePicker Small" } };
export const Large: Story = { args: { size: "lg", children: "DatePicker Large" } };
export const Disabled: Story = { args: { disabled: true, children: "DatePicker Disabled" } };
export const Loading: Story = { args: { loading: true, children: "DatePicker Loading" } };
export const WithIcon: Story = { args: { children: "With Icon", icon: "check" } };
export const FullWidth: Story = { args: { className: "w-full", children: "Full Width" } };
export const CustomStyle: Story = { args: { className: "bg-gradient-to-r from-blue-500 to-purple-500", children: "Custom" } };
