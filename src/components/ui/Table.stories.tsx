// V19-ST005: Table Stories
import type { Meta, StoryObj } from "@storybook/react";
import { Table } from "./Table";

const meta: Meta<typeof Table> = {
  title: "Components/UI/Table",
  component: Table,
  tags: ["autodocs"],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = { args: {} };
export const Primary: Story = { args: { variant: "primary" } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Disabled: Story = { args: { disabled: true } };
