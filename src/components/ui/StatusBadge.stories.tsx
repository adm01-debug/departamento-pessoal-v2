// V20-ST011: StatusBadge Story
import type { Meta, StoryObj } from "@storybook/react";
const meta: Meta = { title: "Components/StatusBadge", tags: ["autodocs"] };
export default meta;
type Story = StoryObj;
export const Default: Story = { args: {} };
export const Active: Story = { args: { active: true } };
export const Disabled: Story = { args: { disabled: true } };
