import type { Meta, StoryObj } from "@storybook/react";
import { Table } from "@/components/ui/Table";

const meta: Meta<typeof Table> = {
  title: "Components/UI/Table",
  component: Table,
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

export const Default: Story = { args: { children: "Table Default" } };
export const Primary: Story = { args: { variant: "primary", children: "Table Primary" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Table Secondary" } };
export const Small: Story = { args: { size: "sm", children: "Table Small" } };
export const Large: Story = { args: { size: "lg", children: "Table Large" } };
export const Disabled: Story = { args: { disabled: true, children: "Table Disabled" } };
export const Loading: Story = { args: { loading: true, children: "Table Loading" } };
export const WithIcon: Story = { args: { children: "With Icon", icon: "check" } };
export const FullWidth: Story = { args: { className: "w-full", children: "Full Width" } };
export const CustomStyle: Story = { args: { className: "bg-gradient-to-r from-blue-500 to-purple-500", children: "Custom" } };
