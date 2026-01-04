import type { Meta, StoryObj } from "@storybook/react";
import { DataGrid } from "@/components/ui/DataGrid";

const meta: Meta<typeof DataGrid> = {
  title: "Components/UI/DataGrid",
  component: DataGrid,
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

export const Default: Story = { args: { children: "DataGrid Default" } };
export const Primary: Story = { args: { variant: "primary", children: "DataGrid Primary" } };
export const Secondary: Story = { args: { variant: "secondary", children: "DataGrid Secondary" } };
export const Small: Story = { args: { size: "sm", children: "DataGrid Small" } };
export const Large: Story = { args: { size: "lg", children: "DataGrid Large" } };
export const Disabled: Story = { args: { disabled: true, children: "DataGrid Disabled" } };
export const Loading: Story = { args: { loading: true, children: "DataGrid Loading" } };
export const WithIcon: Story = { args: { children: "With Icon", icon: "check" } };
export const FullWidth: Story = { args: { className: "w-full", children: "Full Width" } };
export const CustomStyle: Story = { args: { className: "bg-gradient-to-r from-blue-500 to-purple-500", children: "Custom" } };
