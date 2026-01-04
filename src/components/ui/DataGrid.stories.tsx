import type { Meta, StoryObj } from "@storybook/react";
import { DataGrid } from "./DataGrid";

const meta: Meta<typeof DataGrid> = {
  title: "Components/DataGrid",
  component: DataGrid,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "DataGrid" } };
export const WithVariants: Story = { args: { children: "DataGrid Variant", variant: "primary" } };
export const Small: Story = { args: { children: "DataGrid", size: "sm" } };
export const Large: Story = { args: { children: "DataGrid", size: "lg" } };
