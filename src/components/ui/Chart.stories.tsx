// V20-ST009: Chart Story
import type { Meta, StoryObj } from "@storybook/react";
const meta: Meta = { title: "Components/Chart", tags: ["autodocs"] };
export default meta;
type Story = StoryObj;
export const Default: Story = { args: {} };
export const Active: Story = { args: { active: true } };
export const Disabled: Story = { args: { disabled: true } };
