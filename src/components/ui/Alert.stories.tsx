// V19-ST008: Alert Stories
import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./Alert";

const meta: Meta<typeof Alert> = {
  title: "Components/UI/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = { args: {} };
export const Primary: Story = { args: { variant: "primary" } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Disabled: Story = { args: { disabled: true } };
